const User = require("../models/User.model");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/application", (req, res, next) => {
  res.render("application");
});

module.exports = router;
