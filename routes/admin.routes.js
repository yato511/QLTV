const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const book = require("../models/book.js");
const restrict = require("../middlewares/auth.mdw");
const permit = require("../middlewares/authorization.mdw");
const upload = require("../middlewares/uploadBookImage.mdw");
const { route } = require("./guest.routes.js");

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
	users = users.map((user, index) => ({ ...user, index: index + 1 }));
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
			userId
		})
	} else {
		black_list = await db.black_list.destroy({
			where: {
				id
			}
		})
	}
	return res.status(200).json(black_list);
})

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
		isOver: true,
	}));
	const data = { ...user, list };
	console.log(data);
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
			return book;
		})
	);
	res.render("admin/books", {
		title: "Quản lý sách",
		layout: "adminLayout.hbs",
		list: result,
	});
});

router.post("/them-sach", restrict, permit("ADMIN"), upload.single("image"), async (req, res) => {
	console.log(req.body);
	const book = await db.book.create({
		id: req.body.id,
		title: req.body.title,
		cateId: +req.body.category,
		author: req.body.author,
		publisher: req.body.publisher,
		publishYear: req.body.publishYear,
		note: req.body.note
	});
	res.redirect("/admin/books");
});

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

module.exports = router;
