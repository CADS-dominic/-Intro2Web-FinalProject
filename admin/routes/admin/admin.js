var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
	res.render('admin/admin')
})

module.exports = router
