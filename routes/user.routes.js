const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();
const restrict = require("../middlewares/auth.mdw");
const db = require("../models/index");

router.get("/gio-hang", restrict, async (req, res) => {
	const carts = await db.cart.findAll({
		where: {
			userId: req.session.authUser.id
		},
		include: [
			{
				model: db.user
			},
			{
				model: db.book
			}
		],
		raw: true,
		nest:true
	})
	console.log(carts);
	res.render("user/cart", {
		title: "Giỏ hàng",
		list: carts
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

router.get("/lich-su", restrict, async (req, res) => {
	const id = req.session.authUser.id;
	const borrows = await db.borrow_detail.findAll({
		where: {
			userId: id
		},
		include: [
			{
				model: db.book
			}
		],
		raw: true,
		nest: true
	})
	const list = borrows.map((item, index) => ({
		index: index + 1,
		...item,
		isOver: true,
	}));
	res.render("user/history", {
		title: "Lịch sử",
		list
	})
})

module.exports = router;
