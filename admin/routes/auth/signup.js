var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var { adminCollection } = require('../../db')

router.get('/', function (req, res) {
	res.render('auth/signup')
})

router.post('/', async (req, res, next) => {
	const { username, password, repassword, ava } = req.body

	if (
		username == '' ||
		password == '' ||
		repassword != password ||
		repassword == '' ||
		!/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ava)
	) {
		res.send({ error: true })
	} else {
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection
				.insertOne({
					username: username,
					password: hashed,
					activate: false,
					ava: ava,
					iat: Date.now(),
				})
				.then(() => {
					res.send({ error: false })
				})
		})
	}
})

router.get('/checkValid', async (req, res) => {
	const username = req.query.username

	await adminCollection.findOne({ username: username }).then((data) => {
		if (data == null) {
			res.send('ok')
		} else {
			res.send('error')
		}
	})
})

router.get('/verify', (req, res) => {
	res.render('auth/verify')
})

module.exports = router
