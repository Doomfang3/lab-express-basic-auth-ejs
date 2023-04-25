const { isLoggedIn } = require("../middleware/route-guard");
const User = require("../models/User.model");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/application", isLoggedIn, (req, res, next) => {
  console.log(req.session)
  res.render("application", {user: req.session.user});
});

router.get("/main", isLoggedIn, (req, res, next) => {
  console.log(req.session)
  res.render("main", {user: req.session.user});
});

router.get("/private", isLoggedIn, (req, res, next) => {
  console.log(req.session)
  res.render("private", {user: req.session.user});
});

module.exports = router;
