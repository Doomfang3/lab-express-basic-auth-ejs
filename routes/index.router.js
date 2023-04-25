const router = require("express").Router();
const { isLoggedIn } = require("../middleWares/protect.router.js");

/* GET home page */
router.get("/", (req, res, next) => {
	res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
	res.render("profile", { userName: req.session.userName });
});

router.get("/main", isLoggedIn, (req, res, next) => {
	res.render("extra/main", { userName: req.session.userName });
});

module.exports = router;
