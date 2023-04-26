const router = require("express").Router();
const { isLoggedIn } = require('../middleware/route-guard.js')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('profile', { username: req.session.username })
})

/*router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err)
    res.redirect('/')
  })
})*/

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render("main", { username: req.session.username });
})

module.exports = router;