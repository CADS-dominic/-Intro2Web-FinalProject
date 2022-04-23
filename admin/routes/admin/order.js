var express = require('express')
const passport = require('passport')
var router = express.Router()
var { orderCollection, productCollection } = require('../../db')
const cloudinary = require('../../configs/cloudinary')
const { ObjectId } = require('mongodb')

const itemPerPage = 5

router.get('/', passport.checkAuth, async function (req, res) {
	let orders = []
	const { input } = req.query
	await orderCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			orders.push(doc)
		} else {
			if (doc.status.toLowerCase().includes(input.toLowerCase())) orders.push(doc)
		}
	})

	orders.sort((a, b) => {
		if (parseInt(a.iat) < parseInt(b.iat)) return -1
		if (parseInt(a.iat) > parseInt(b.iat)) return 1
		return 0
	})

	let result = []
	for (let i = 0; i < itemPerPage && orders[i] != null; i++) {
		result.push(orders[i])
	}

	if (input == undefined) {
		res.render('admin/order', {
			username: req.user.username,
			ava: req.user.ava,
			orders: result,
		})
	} else {
		res.send({ orders: result })
	}
})

router.post('/pagin', async (req, res) => {
	const input = req.body.input

	let orders = []
	if (input == undefined) {
		await orderCollection.find({}).forEach((doc) => {
			orders.push(doc)
		})
	} else {
		await orderCollection.find({}).forEach((doc) => {
			if (doc.status.toLowerCase().includes(input.toLowerCase())) orders.push(doc)
		})
	}

	res.send({ totalPages: Math.ceil(orders.length / itemPerPage) })
})

router.post('/next', async (req, res) => {
	let orders = []
	const { input } = req.query
	await orderCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			orders.push(doc)
		} else {
			if (doc.status.toLowerCase().includes(input.toLowerCase())) orders.push(doc)
		}
	})

	orders.sort((a, b) => {
		if (parseInt(a.iat) < parseInt(b.iat)) return -1
		if (parseInt(a.iat) > parseInt(b.iat)) return 1
		return 0
	})

	let currentPage = req.body.currentPage
	if (currentPage < Math.ceil(orders.length / itemPerPage)) {
		let result = []
		for (let i = 0; i < orders.length; i++) {
			if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
				result.push(orders[i])
			}
		}
		res.send({ currentPage: parseInt(currentPage) + 1, orders: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/prev', async (req, res) => {
	let orders = []
	const { input } = req.query
	await orderCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			orders.push(doc)
		} else {
			if (doc.status.toLowerCase().includes(input.toLowerCase())) orders.push(doc)
		}
	})

	orders.sort((a, b) => {
		if (parseInt(a.iat) < parseInt(b.iat)) return -1
		if (parseInt(a.iat) > parseInt(b.iat)) return 1
		return 0
	})

	let prevPage = req.body.currentPage - 1
	if (prevPage > 0) {
		let result = []
		for (let i = 0; i < orders.length; i++) {
			if (i >= (prevPage - 1) * itemPerPage && i <= (prevPage - 1) * itemPerPage + itemPerPage - 1) {
				result.push(orders[i])
			}
		}
		res.send({ currentPage: parseInt(prevPage), orders: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/goto', async (req, res) => {
	let orders = []
	const { input } = req.query
	await orderCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			orders.push(doc)
		} else {
			if (doc.status.toLowerCase().includes(input.toLowerCase())) orders.push(doc)
		}
	})

	orders.sort((a, b) => {
		if (parseInt(a.iat) < parseInt(b.iat)) return -1
		if (parseInt(a.iat) > parseInt(b.iat)) return 1
		return 0
	})

	let currentPage = req.body.page - 1
	let result = []
	for (let i = 0; i < orders.length; i++) {
		if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
			result.push(orders[i])
		}
	}
	res.send({ currentPage: parseInt(currentPage) + 1, orders: result })
})

router.get('/details', passport.checkAuth, async (req, res) => {
	let orders = []
	await orderCollection.find({}).forEach((doc) => {
		orders.push(doc)
	})

	const result = orders.find((order) => order._id == req.query.id)

	let products = []
	for (let product of result.productList) {
		await productCollection.findOne({ _id: ObjectId(product.id) }).then((data) => {
			const item = {
				ava: data.ava[0],
				name: data.name,
				price: data.price,
				quantity: product.quantity,
			}
			products.push(item)
		})
	}

	res.render('order/details', {
		order: {
			...result,
			iat: new Date(result.iat),
			isDelivery: result.status == 'delivery' ? true : false,
			isPending: result.status == 'pending' ? true : false,
		},
		products: products,
		username: req.user.username,
		ava: req.user.ava,
	})
})

router.post('/deli', async (req, res) => {
	await orderCollection.updateOne(
		{ _id: ObjectId(req.body.id) },
		{
			$set: {
				status: 'delivery',
			},
		}
	)

	res.send({ error: false })
})

router.post('/done', async (req, res) => {
	await orderCollection.updateOne(
		{ _id: ObjectId(req.body.id) },
		{
			$set: {
				status: 'completed',
			},
		}
	)

	res.send({ error: false })
})

module.exports = router
