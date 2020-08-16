const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const multer = require("multer");
const book = require("../models/book.js");

router.get("/", async (req, res) => {
	res.redirect("/admin/dashboard");
});
router.get("/dashboard", async (req, res) => {
	res.render("admin/dashboard", {
		title: "Dashboard",
		layout: "adminLayout.hbs",
	});
});
router.get("/users", async (req, res) => {
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

router.get("/users/:id", async (req, res) => {
	const { id } = req.params;
	const user = await db.user.findOne({
		where: {
			id: id,
		},
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
	console.log(list);
	res.render("admin/usersDetail", {
		title: "Quản lý độc giả",
		layout: "adminLayout.hbs",
		data,
	});
});
router.get("/books", async (req, res) => {
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

router.post("/books", async (req, res) => {
	const book = await db.book.create(req.body.book);
	const storage = multer.diskStorage({
		filename: function (req, file, cb) {
			cb(null, `${book.id}.png`);
		},
		destination: function (req, file, cb) {
			cb(null, `./public/imgs/books/`);
		},
	});
	const upload = multer({ storage });
	upload.single("image")(req, res, function (err) {
		if (err) {
			res.json("error");
		} else {
			res.status(200).json("success");
		}
	});
});

router.put("/books/:id", async (req, res) => {
	const { id } = req.params;
	const book = await db.book.update(req.body, {
		where: {
			id,
		},
	});

	return res.json(book);
});

router.delete("/books/:id", async (req, res) => {
	const { id } = req.params;
	const book = await db.book.destroy({
		where: {
			id,
		},
	});
	return res.json(book);
});
module.exports = router;
