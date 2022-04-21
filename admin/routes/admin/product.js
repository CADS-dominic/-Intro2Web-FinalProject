var express = require('express')
const passport = require('passport')
var router = express.Router()
var { productCollection } = require('../../db')

const itemPerPage = 5

router.get('/', passport.checkAuth, async function (req, res) {
	let products = []
	const { input, sort } = req.query
	await productCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			products.push(doc)
		} else {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) products.push(doc)
		}
	})

	// if (sort == 'username' || sort == undefined) {
	// 	products.sort((a, b) => {
	// 		if (a.username < b.username) return -1
	// 		if (a.username > b.username) return 1
	// 		return 0
	// 	})
	// } else {
	// 	products.sort((a, b) => {
	// 		if (a.iat < b.iat) return -1
	// 		if (a.iat > b.iat) return 1
	// 		return 0
	// 	})
	// }

	let result = []
	for (let i = 0; i < itemPerPage; i++) {
		result.push(products[i])
	}

	if (input == undefined) {
		res.render('admin/product', {
			username: req.user.username,
			ava: req.user.ava,
			products: result,
		})
	} else {
		res.send({ products: result })
	}
})

module.exports = router
