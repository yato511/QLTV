const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const multer = require("multer");

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
	const users = await db.user.findAll({
		include: [
			{
				model: db.black_list
			}
		]
	})
	res.json(users)
});
router.get("/books", async (req, res) => {
	const books = await db.book.findAll({
		include: [
			{
				model: db.category
			}
		]
	});

	let result = [];

	for (let book of books) {
		if (book.isAvailable == 0) {
			const borrow = await db.borrow_detail.findOne({
				where: {
					bookId: book.id
				}
			})

			if (borrow) {
				const user = await db.user.findOne({
					where: {
						id: borrow.userId
					}
				});
				book.dataValues.user = user;
			}
		}
		result.push(book.dataValues);
	}
	return res.json(result);
});

router.post("/books", async (req, res) => {
	const book = await db.book.create(req.body.book);
	const storage = multer.diskStorage({
		filename: function (req, file, cb) {
		  cb(null, `${book.id}.png`)
		},
		destination: function (req, file, cb) {
		  cb(null, `./public/imgs/`);
		},
	});
	const upload = multer({ storage });
	upload.single("image")(req, res, function (err) {
		if (err) {
			res.json("error");
		} else {
		  res.status(200).json("success");
		}
	})
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
