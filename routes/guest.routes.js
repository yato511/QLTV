const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();
const config = require("../config/default.json");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const db = require("../models/index.js");
const { Sequelize } = require("../models/index.js");
const Op = Sequelize.Op;

router.get("/", async (req, res) => {
	const categories = await db.category.findAll({
		raw: true,
		nest: true,
	});
	const newBooks = await db.book.findAll({
		order: [["createdAt", "DESC"]],
		limit: 4,
		include: [
			{
				model: db.category,
			},
		],
		raw: true,
		nest: true,
	});
	console.log(req.session.authUser);
	res.render("guest/home", {
		title: "Trang chủ",
		category: categories,
		newBooks,
		user: req.session.authUser,
	});
});
router.get("/danh-sach/:id", async (req, res) => {
	const [category, books] = await Promise.all([
		db.category.findOne({
			where: {
				id: req.params.id,
			},
			raw: true,
			nest: true,
		}),
		db.book.findAll({
			where: {
				cateId: req.params.id,
			},
			raw: true,
			nest: true,
		}),
	]);

	res.render("guest/bookList", {
		title: "Danh sách sách",
		category: category,
		list: books,
		user: req.session.authUser,
	});
});
router.get("/chi-tiet-sach/:id", async (req, res) => {
	const [book, cartCount] = await Promise.all([
		db.book.findOne({
			where: {
				id: req.params.id,
			},
			include: [
				{
					model: db.category,
				},
			],
			raw: true,
			nest: true,
		}),
		db.cart.count({
			where: {
				userId: req.session.isAuthenticated ? req.session.authUser.id : -1,
				bookId: req.params.id,
			},
		}),
	]);

	res.render("guest/bookDetail", {
		title: "Chi tiết sách",
		book,
		user: req.session.authUser,
		isInCart: cartCount > 0,
		user: req.session.authUser,
	});
});
router.get("/login", async (req, res) => {
	if (req.session.authUser) {
		res.redirect("/");
	} else {
		res.render("guest/login", {
			layout: false,
			title: "Đăng nhập",
		});
	}
});

router.post("/login", async (req, res) => {
	console.log("đã vô");
	const user = await db.user.findOne({
		where: {
			username: req.body.username,
		},
	});
	if (user == null) {
		return res.render("guest/login", {
			layout: false,
			title: "Đăng nhập",
			err: "Tên đăng nhập hoặc mật khẩu không đúng",
		});
	}
	const rs = bcrypt.compareSync(req.body.password, user.password);
	if (rs === false) {
		return res.render("guest/login", {
			layout: false,
			title: "Đăng nhập",
			err: "Tên đăng nhập hoặc mật khẩu không đúng",
		});
	}
	delete user.dataValues.password;
	req.session.isAuthenticated = true;
	req.session.authUser = user.dataValues;
	req.session.authUser.isAdmin = user.dataValues.role === "ADMIN";

	if (user.dataValues.role === "ADMIN") {
		const url = req.query.retUrl || "/admin";
		res.redirect(url);
	} else {
		const url = req.query.retUrl || "/";
		res.redirect(url);
	}
});

router.get("/signup", async (req, res) => {
	if (req.session.authUser) {
		res.redirect("/");
	} else {
		res.render("guest/signup", {
			layout: false,
			title: "Đăng ký",
		});
	}
});
router.post("/signup", async (req, res) => {
	const hash = bcrypt.hashSync(
		req.body.password,
		config.authentication.saltRounds
	);
	let birthday = req.body.birthday;
	let createdDate = req.body.createdDate;
	let expiredDate = req.body.expiredDate;
	if (typeof birthday != "undefined")
		birthday = moment(req.body.birthday, "DD/MM/YYYY").format("YYYY-MM-DD");
	if (typeof createdDate != "undefined")
		createdDate = moment(req.body.createdDate, "DD/MM/YYYY").format(
			"YYYY-MM-DD"
		);
	if (typeof expiredDate != "undefined")
		expiredDate = moment(req.body.expiredDate, "DD/MM/YYYY").format(
			"YYYY-MM-DD"
		);

	const entity = {
		username: req.body.username,
		password: hash,
		name: req.body.name,
		class: req.body.class,
		email: req.body.email,
		address: req.body.address,
		birthday,
		expiredDate,
		createdDate,
	};
	const ret = await db.user.create(entity);
	res.redirect("/");
});

router.get("/logout", (req, res) => {
	req.session.authUser = null;
	req.session.isAuthenticated = false;
	res.redirect(req.headers.referer);
});

router.get("/search", async (req, res) => {
	const { query } = req.query;
	const books = await db.book.findAll({
		where: {
			[Op.or]: [
				{
					title: {
						[Op.like]: `%${query}%`,
					},
				},
				{
					author: {
						[Op.like]: `%${query}%`,
					},
				},
				{
					publisher: {
						[Op.like]: `%${query}%`,
					},
				},
			],
		},
		raw: true,
		nest: true,
		include: [
			{
				model: db.category,
			},
		],
	});
	res.status(200).json({
		query,
		list: books,
		user: req.session.authUser,
	});
});

module.exports = router;
