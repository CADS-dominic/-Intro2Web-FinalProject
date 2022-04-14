var express = require('express')
var router = express.Router()
var { adminCollection } = require('../../db')

router.get('/', function (req, res) {
	res.render('auth/login')
})

router.post('/login', async (req, res) => {
	let adminList = []
	const { username, password } = req.body
	console.log(username, password)
	await adminCollection
		.find({ username: username, password: password })
		.forEach((doc) => {
			adminList.push(doc)
		})

	if (adminList.length == 0) {
		res.send({ error: true })
	} else {
		res.send({ error: false })
	}
})

module.exports = router
