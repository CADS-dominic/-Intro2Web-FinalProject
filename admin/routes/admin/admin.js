var express = require('express')
const passport = require('passport')
var router = express.Router()
var { adminCollection } = require('../../db')
var bcrypt = require('bcrypt')
const cloudinary = require('../../configs/cloudinary')

router.get('/', passport.checkAuth, async function (req, res) {
	res.render('admin/admin', { username: req.user.username, ava: req.user.ava })
})

router.post('/', passport.checkAuth, async (req, res) => {
	const { password, repassword, ava } = req.body

	if (password == '' || repassword == '' || ava == undefined || password != repassword) {
		res.render('admin/admin', { username: req.user.username, ava: req.user.ava })
	} else {
		const cloudinaryResponse = await cloudinary.uploader.upload(ava, {
			upload_preset: 'avatars',
			public_id: req.user.username,
		})
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection.updateOne(
				{ username: req.user.username },
				{
					$set: {
						password: hashed,
						ava: cloudinaryResponse.url,
					},
				}
			)
			res.render('admin/admin', { username: req.user.username, ava: ava })
		})
	}
})

module.exports = router
