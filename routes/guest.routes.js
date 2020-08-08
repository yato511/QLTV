const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("guest/home", {
		title: "Trang chủ",
	});
});
router.get("/danh-sach/:id", async (req, res) => {
	res.render("guest/bookList", {
		title: "Danh sách sách",
	});
});
router.get("/chi-tiet-sach/:id", async (req, res) => {
	res.render("guest/bookDetail", {
		title: "Chi tiết sách",
	});
});
router.get("/login", async (req, res) => {
	res.render("guest/login", {
		layout: false,
		title: "Đăng nhập",
	});
});
router.get("/signup", async (req, res) => {
	res.render("guest/signup", {
		layout: false,
		title: "Đăng ký",
	});
});

module.exports = router;
