module.exports = function (app) {
	app.use("/", require("../routes/guest.routes"));
	app.use("/user", require("../routes/user.routes"));
	app.use("/admin", require("../routes/admin.routes"));
};
