const express = require("express");
const router = express.Router();
const db = require("../models/index.js");

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
	res.render("admin/users", {
		title: "QL Độc giả",
		layout: "adminLayout.hbs",
	});
});
router.get("/books", async (req, res) => {
	const books = await db.book.findAll();
	return res.json(books);
});

router.post("/books", async (req, res) => {
	const book = await db.book.create(req.body);

	return res.json(book instanceof db.book);
})

router.put("/books/:id", async (req, res) => {
	const { id } = req.params;
	const book = await db.book.update(
		req.body,
		{
			where: {
				id
			}
		}
	)
	
	return res.json(book)
})

router.delete("/books/:id", async (req, res) => {
	const { id } = req.params;
	const book = await db.book.destroy({
		where: {
			id
		}
	})
	return res.json(book);
})
module.exports = router;
