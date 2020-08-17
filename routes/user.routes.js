const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();
const restrict = require("../middlewares/auth.mdw");
const db = require("../models/index");

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

router.get("/gio-hang", restrict, async (req, res) => {
	const carts = await db.cart.findAll({
		where: {
			userId: req.session.authUser.id,
		},
		include: [
			{
				model: db.user,
			},
			{
				model: db.book,
			},
		],
		raw: true,
		nest: true,
	});
	res.render("user/cart", {
		title: "Giỏ hàng",
		list: carts,
		isEmpty: carts.length === 0,
		user: req.session.authUser,
	});
});

router.post("/add-cart", restrict, async (req, res) => {
	const { userId, bookId } = req.body;
	const cart = await db.cart.create({
		userId,
		bookId,
	});
	return res.status(200).json(cart);
});

router.post("/submit-cart", restrict, async (req, res) => {});

router.delete("/cart", restrict, async (req, res) => {
	const { bookId, userId } = req.body;
	const cart = await db.cart.destroy({
		where: {
			bookId,
			userId
		}
	})
	return res.json(cart);
})

router.get("/lich-su", restrict, async (req, res) => {
	const id = req.session.authUser.id;
	const borrows = await db.borrow_detail.findAll({
		where: {
			userId: id,
		},
		include: [
			{
				model: db.book,
			},
		],
		raw: true,
		nest: true,
	});
	const list = borrows.map((item, index) => ({
		index: index + 1,
		...item,
		createdAt: formatDateTime(item.createdAt),
		returnDate: formatDateTime(item.returnDate),
	}));
	res.render("user/history", {
		title: "Lịch sử",
		list,
		user: req.session.authUser,
	});
});

module.exports = router;
