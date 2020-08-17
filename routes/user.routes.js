const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();
const restrict = require("../middlewares/auth.mdw");
const db = require("../models/index");

router.get("/gio-hang", restrict, (req, res) => {
	res.render("user/cart", {
		title: "Giỏ hàng",
	});
});

router.post("/add-cart", restrict, async (req, res) => {
	console.log(req.body);
	const { userId, bookId } = req.body;
	const cart = await db.cart.create({
		userId,
		bookId
	})
	return res.status(200).json(cart);
})

module.exports = router;
