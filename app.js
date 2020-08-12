const express = require("express");
const exphbs = require("express-handlebars");
const hbs_sections = require("express-handlebars-sections");

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(express.static("public"));

app.engine(
	"hbs",
	exphbs({
		defaultLayout: "userLayout.hbs",
	})
);
app.set("view engine", "hbs");

require('./middlewares/session.mdw')(app);

require("./middlewares/routes.mdw")(app);

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
