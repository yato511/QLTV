const express = require("express");
const router = express.Router();

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
	res.render("admin/books", {
		title: "QL Sách",
		layout: "adminLayout.hbs",
	});
});

module.exports = router;
