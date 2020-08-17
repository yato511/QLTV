const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();
const config = require("../config/default.json");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const db = require("../models/index.js");

router.get("/", async (req, res) => {
	const category = await db.category.findAll({ raw: true });
	res.render("guest/home", {
		title: "Trang chủ",
		category,
	});
});
router.get("/danh-sach/:id", async (req, res) => {
	const category = await db.category.findOne({
		where: {
			id: req.params.id,
		},
		raw: true,
	});
	const list = await db.book.findAll({
		where: {
			cateId: req.params.id,
		},
		raw: true,
	});
	res.render("guest/bookList", {
		title: "Danh sách sách",
		list,
		category,
	});
});
router.get("/chi-tiet-sach/:id", async (req, res) => {
	const book = await db.book.findOne({
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
	});
	res.render("guest/bookDetail", {
		title: "Chi tiết sách",
		book,
	});
});
router.get("/login", async (req, res) => {
	res.render("guest/login", {
		layout: false,
		title: "Đăng nhập",
	});
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

	const url = req.query.retUrl || "/";
	res.redirect(url);
});

router.get("/signup", async (req, res) => {
	res.render("guest/signup", {
		layout: false,
		title: "Đăng ký",
	});
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
	res.render("guest/signup", {
		layout: false,
		title: "Đăng ký",
	});
});
module.exports = router;
