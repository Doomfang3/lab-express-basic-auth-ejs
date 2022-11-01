const router = require("express").Router();
const User = require("../models/User.model.js");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const { isLoggedIn } = require("../middleware/route-guard");

//const session = require('express-session')
//const mongoStore = require ('connect-mongo')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // make sure users fill all mandatory fields:
    if (!username || !password) {
      res.render("signup", {
        errorMessage:
          "All fields are mandatory. Please provide your username and password.",
      });
      return;
    }
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    let userFromDB = await User.create({
      username,
      password: hashedPassword,
    });
    req.session.currentUser = userFromDB;
    console.log(`Newly created user is: ${username}`, userFromDB);
    res.redirect("/profile");
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).render("signup", {
        errorMessage:
          "Username needs to be unique. Username is already used by another user.",
      });
    }
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // make sure users fill all mandatory fields:
    if (!username || !password) {
      res.render("login", {
        errorMessage:
          "All fields are mandatory. Please provide your username and password.",
      });
      return;
    }
    const check = await User.find({ username });
    console.log(check);
    console.log(check[0].password);
    if (Object.keys(check).length >= 1) {
      if (bcryptjs.compareSync(password, check[0].password)) {
        console.log("SESSION =====> ", req.session);
        req.session.currentUser = check[0];
        res.redirect("/profile");
      } else {
        res.render("login", { errorMessage: "Incorrect password." });
      }
    }
  } catch (error) {
    console.log("logging in the user failed", error);
  }
});

router.get("/profile", (req, res) => {
  res.render("profile", { userInSession: req.session.currentUser });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main", { userInSession: req.session.currentUser });
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { userInSession: req.session.currentUser });
});

module.exports = router;
