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
    //console.log(!!potentialUser,req.body.username )
    
    /* --- 2-1. Check if username has existed --- */
    if(!potentialUser){
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

module.exports = router;