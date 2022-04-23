var express = require('express');

const { ObjectId } = require('mongodb');
var client = require('../db');
var router = express.Router();

const userCol = client.db('ver2').collection('users');
const productCol = client.db('ver2').collection('products');
const ordersCol = client.db('ver2').collection('orders');

router.get('/:value', async (req, res, next) => {

  const result = await productCol.find( { name: { $regex : new RegExp(req.params.value) } } ).toArray();

  const init = {
    result,
  }

  res.render('customerSearch.ejs', init);

});

module.exports = router;
