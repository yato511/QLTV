const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const book = require("../models/book.js");
const restrict = require("../middlewares/auth.mdw");
const permit = require("../middlewares/authorization.mdw");
const upload = require("../middlewares/uploadBookImage.mdw");
const { route } = require("./guest.routes.js");

const formatDateTime = (date) => {
	if (date) {
		let dd = date.getDate();
		let mm = date.getMonth() + 1;
		let yyyy = date.getFullYear();
		let hh = date.getHours();
		let min = date.getMinutes();
		if (dd < 10) dd = "0" + dd;
		if (mm < 10) mm = "0" + mm;
		if (hh < 10) hh = "0" + hh;
		if (min < 10) min = "0" + min;
		return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
	} else return null;
};

router.get("/", restrict, permit("ADMIN"), async (req, res) => {
	res.redirect("/admin/dashboard");
});
router.get("/dashboard", restrict, permit("ADMIN"), async (req, res) => {
	res.render("admin/dashboard", {
		title: "Dashboard",
		layout: "adminLayout.hbs",
	});
});
router.get("/users", restrict, permit("ADMIN"), async (req, res) => {
	let users = await db.user.findAll({
		include: [
			{
				model: db.black_list,
			},
		],
		raw: true,
		nest: true,
	});
	users = users.map((user, index) => ({
		...user,
		index: index + 1,
		createdAt: formatDateTime(user.createdAt),
	}));
	res.render("admin/users", {
		title: "Quản lý độc giả",
		layout: "adminLayout.hbs",
		list: users,
	});
});

router.post("/ban-user", restrict, permit("ADMIN"), async (req, res) => {
	const { userId, id } = req.body;
	console.log(id);
	let black_list;
	if (!id) {
		black_list = await db.black_list.create({
			userId,
		});
	} else {
		black_list = await db.black_list.destroy({
			where: {
				id,
			},
		});
	}
	return res.status(200).json(black_list);
});

router.get("/users/:id", restrict, permit("ADMIN"), async (req, res) => {
	const { id } = req.params;
	const user = await db.user.findOne({
		where: {
			id: id,
		},
		include: [
			{
				model: db.black_list,
			},
		],
		nest: true,
		raw: true,
	});
	const borrows = await db.borrow_detail.findAll({
		where: {
			userId: id,
		},
		include: [
			{
				model: db.book,
			},
		],
		nest: true,
		raw: true,
	});

	const list = borrows.map((item, index) => ({
		index: index + 1,
		...item,
		createdAt: formatDateTime(item.createdAt),
		returnDate: formatDateTime(item.returnDate),
	}));
	const data = { ...user, list };
	res.render("admin/usersDetail", {
		title: "Quản lý độc giả",
		layout: "adminLayout.hbs",
		data,
	});
});
router.get("/books", restrict, permit("ADMIN"), async (req, res) => {
	const books = await db.book.findAll({
		include: [
			{
				model: db.category,
			},
		],
		nest: true,
		raw: true,
	});
	let result;
	result = await Promise.all(
		books.map(async (book, index) => {
			if (book.isAvailable == 0) {
				const borrow = await db.borrow_detail.findOne({
					where: {
						bookId: book.id,
					},
					raw: true,
				});
				if (borrow) {
					const user = await db.user.findOne({
						where: {
							id: borrow.userId,
						},
						raw: true,
					});
					book.user = user;
				}
			}
			book.index = index + 1;
			book.createdAt = formatDateTime(book.createdAt);
			return book;
		})
	);
	res.render("admin/books", {
		title: "Quản lý sách",
		layout: "adminLayout.hbs",
		list: result,
	});
});

router.post(
	"/them-sach",
	restrict,
	permit("ADMIN"),
	upload.single("image"),
	async (req, res) => {
		console.log(req.body);
		const book = await db.book.create({
			id: req.body.id,
			title: req.body.title,
			cateId: +req.body.category,
			author: req.body.author,
			publisher: req.body.publisher,
			publishYear: req.body.publishYear,
			note: req.body.note,
		});
		res.redirect("/admin/books");
	}
);

router.put("/books/:id", restrict, permit("ADMIN"), async (req, res) => {
	const { id } = req.params;
	const book = await db.book.update(req.body, {
		where: {
			id,
		},
	});

	return res.json(book);
});

router.delete("/books/:id", restrict, permit("ADMIN"), async (req, res) => {
	const { id } = req.params;
	const book = await db.book.destroy({
		where: {
			id,
		},
	});
	return res.json(book);
});

router.get("/them-sach", async (req, res) => {
	const category = await db.category.findAll({
		raw: true,
	});
	res.render("admin/addBook", {
		title: "Thêm sách",
		layout: "adminLayout.hbs",
		category,
	});
});

router.get("/danh-muc", async (req, res) => {
	let list = await db.category.findAll({
		raw: true,
	});
	list = await Promise.all(
		list.map(async (item, index) => {
			const list = await db.book.findAll({
				where: {
					cateId: item.id,
				},
				raw: true,
				nest: true,
			});
			return {
				...item,
				index: index + 1,
				quantity: list.length,
			};
		})
	);
	res.render("admin/category", {
		title: "Quản lý danh mục",
		layout: "adminLayout.hbs",
		list,
	});
});

router.post("/add-cate", async (req, res) => {
	const entity = {
		name: req.body.name,
		createdAt: new Date(),
	};
	console.log(entity);
	await db.category.create(entity);
	res.json(1);
});

module.exports = router;
