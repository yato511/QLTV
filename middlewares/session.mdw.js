const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

module.exports = function (app) {
	app.set("trust proxy", 1); // trust first proxy
	app.use(
		session({
			secret: "keyboard cat",
			resave: false,
			saveUninitialized: true,
			// cookie: { secure: true }

			store: new MySQLStore({
				connectionLimit: 100,
				host: "us-cdbr-east-02.cleardb.com",
				port: 3306,
				user: "b76216e132d341",
				password: "09597f51",
				database: "heroku_18ad71bd3e0d1d7",
				charset: "utf8",
				schema: {
					tableName: "sessions",
					columnNames: {
						session_id: "session_id",
						expires: "expires",
						data: "data",
					},
				},
			}),
		})
	);
};
