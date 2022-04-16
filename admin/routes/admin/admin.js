var express = require('express')
const passport = require('passport')
var router = express.Router()

router.get('/', passport.checkAuth, function (req, res) {
	res.render('admin/admin')
})

module.exports = router
