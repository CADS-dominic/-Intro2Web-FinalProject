var express = require('express')
const passport = require('passport')
var router = express.Router()
var { adminCollection } = require('../../db')
var bcrypt = require('bcrypt')

router.get('/', passport.checkAuth, function (req, res) {
	res.render('admin/admin', { username: req.user.username, ava: req.user.ava })
})

router.post('/', passport.checkAuth, async (req, res) => {
	const { password, repassword, ava } = req.body

	if (password == '' || repassword == '' || ava == '' || password != repassword) {
		res.render('admin/admin', { username: req.user.username, ava: req.user.ava, error: 'Invalid input' })
	} else {
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection.updateOne(
				{ username: req.user.username },
				{
					$set: {
						password: hashed,
						ava: ava,
					},
				}
			)
			res.render('admin/admin', { username: req.user.username, ava: ava, success: 'Save!' })
		})
	}
})

module.exports = router
