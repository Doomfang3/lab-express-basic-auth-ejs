const express = require('express');
const User = require('../models/User.model');
const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const roundOfSalt = 13;

const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;


/* --- 1. GET to display signup page --- */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


/* --- 2. POST Signup page --- */
router.post("/signup", async(req, res, next) => {
  
  try {   
    const potentialUser = await User.findOne({username: req.body.username})

    /* --- 2-1. Check if username has existed --- */
    if(!!potentialUser === false){
      // Why are we checking !potentialUser than !!potentialUser??
      const pwdStrength = pwdRegex.test(req.body.password);
      console.log(pwdStrength,req.body.password)

      /* --- 2-2. If not existed, check if password is strong enough --- */
      if(pwdRegex.test(req.body.password)) {
        
        /* ---- 2-3. If password is strong enough, createe a new user ---- */ 
        const salt = bcryptjs.genSaltSync(roundOfSalt);
        const passwordHash = bcryptjs.hashSync(req.body.password, salt);
        
        await User.create({username: req.body.username, password: passwordHash});
        res.redirect('/auth/login')

      } else {
        /* ---- 2-4. If psw is not strong enough, render singup page and show error message ---- */
        res.render('auth/signup', {
          errorMessage: 'Password is not strong enough',
          data: { username: req.body.username }
        })
      }
    } else {
      /* --- 2-5. If user is existed, render singup page and show error message --- */
      res.render('auth/signup', {
        errorMessage: 'Username is in use',
        data: { username: req.body.username }
      })
    }
  } catch (error) {
    console.log("Error from signup post: ", error)
  }
})


/* --- 3. GET to display login page --- */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


/* --- 4. POST Login page --- */
router.post("/login", async(req, res, next) => {

  const { username, password } = req.body;

  try {

    const loginUser = await User.findOne({username})

    /* --- 4-1. Check if username has existed --- */
    if(!!loginUser === true) {

      /* --- 4-2. Check if password is correct --- */
      if (bcryptjs.compareSync(password, loginUser.password)) {
        
        // console.log(req.session) => undefined
        req.session.username = loginUser.username
        res.redirect('/profile')

      } else {
        res.render('auth/login', { errorMessage: 'Wrong password', username})
      }
    } else {
      /* --- 4-3. If the given username does not exist --- */
      res.render('auth/login', { errorMessage: 'User does not exist', username})
    }
  } catch (error) {
    console.log("Error from login post: ", error)
  }
})

module.exports = router;