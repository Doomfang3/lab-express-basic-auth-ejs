const router = require("express").Router();
const bcrypt = require('bcryptjs')

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});






// router.get('/signup', (req, res) => {
//     res.render('auth/signup')
// })


module.exports = router;