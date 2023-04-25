const router = require("express").Router();
const User = require("../models/User.model.js");
const bcryptjs = require("bcryptjs");

const saltRounds = 13;
const pwdRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

const { isLoggedOut } = require("../middleWares/protect.router.js");

router.get("/signup", (req, res, next) => {
	res.render("auth/signup", { errorMessage: undefined });
});

router.post("/signup", async (req, res, next) => {
	const { userName, password } = req.body;

	try {
		const potentialUser = await User.findOne({ userName: userName });
		if (!potentialUser) {
			if (pwdRegex.test(password)) {
				const salt = bcryptjs.genSaltSync(saltRounds);
				const passwordHash = bcryptjs.hashSync(password, salt);
				await User.create({ userName, passwordHash });
				res.redirect("/auth/login");
			} else {
				res.render("auth/signup", {
					errorMessage: "Your password is too weak.",
				});
			}
		} else {
			res.render("auth/signup", {
				errorMessage: `User name "${userName}" is taken, please use another one.`,
				userName,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/login", isLoggedOut, (req, res, next) => {
	res.render("auth/login", {
		errorMessage: undefined,
	});
});

router.post("/login", async (req, res, next) => {
	const { userName, password } = req.body;
	try {
		const user = await User.findOne({ userName: userName });
		if (!!user) {
			//compare input pwd with pwdHash in DB
			if (bcryptjs.compareSync(password, user.passwordHash)) {
				req.session.userName = user.userName;
				res.redirect("/profile");
			} else {
				//wrong pwd
				res.render("auth/login", {
					errorMessage: "The password is wrong",
				});
			}
		} else {
			//dont have this user name in DB
			res.render("auth/login", {
				errorMessage: `User name "${userName}" does not exsist.`,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
