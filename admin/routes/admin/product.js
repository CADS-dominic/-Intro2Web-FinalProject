var express = require('express')
const passport = require('passport')
var router = express.Router()

router.get('/', passport.checkAuth, function (req, res) {
	res.render('admin/product', { username: req.user.username, ava: req.user.ava })
})

module.exports = router
