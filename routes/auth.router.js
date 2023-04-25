const router = require("express").Router();
const User = require("../models/User.model.js");
const bcryptjs = require("bcryptjs");

const saltRounds = 13;

router.get("/signup", (req, res, next) => {
	res.render("auth/signup", { errorMessage: undefined });
});

router.post("/signup", async (req, res, next) => {
	const { userName, password } = req.body;
	const potentialUser = User.findOne({ userName: userName });

	try {
		if (!potentialUser) {
			const salt = bcryptjs.genSaltSync(saltRounds);
			const passwordHash = bcryptjs.hashSync(password, salt);
			await User.create({ userName, passwordHash });
			res.redirect("/auth/login");
		} else {
			res.render("auth/signup", {
				errorMessage: "User name is taken, please use another one",
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/login", (req, res, next) => {
	res.render("auth/login");
});

module.exports = router;
