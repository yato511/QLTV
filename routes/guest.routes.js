const express = require("express");
const router = express.Router();
const config = require("../config/default.json");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const db = require("../models/index.js");

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
router.post("/signup", async (req, res) => {
	console.log("đã vô")
	const hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
	let birthday = req.body.birthday;
	let createdDate = req.body.createdDate;
	let expiredDate = req.body.expiredDate;
	if (typeof birthday != "undefined")
		birthday = moment(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
	if (typeof createdDate != "undefined")
		createdDate = moment(req.body.createdDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
	if (typeof expiredDate != "undefined")
		expiredDate = moment(req.body.expiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

  	const entity = {
    	username: req.body.username,
    	password: hash,
    	name: req.body.name,
		class: req.body.class,
		email: req.body.email,
		address: req.body.address,
    	birthday,
		expiredDate,
		createdDate
	}
  	const ret = await db.user.create(entity);
  	res.render("guest/signup", {
		layout: false,
		title: "Đăng ký",
	});
})
module.exports = router;
