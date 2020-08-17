const express = require("express");
const { route } = require("./admin.routes");
const router = express.Router();

router.get("/gio-hang", (req, res) => {
	res.render("user/cart", {
		title: "Giỏ hàng",
	});
});

module.exports = router;
