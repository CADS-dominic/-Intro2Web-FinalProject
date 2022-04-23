var express = require('express');

const { ObjectId } = require('mongodb');
var client = require('../db');
var router = express.Router();

const userCol = client.db('ver2').collection('users');
const productCol = client.db('ver2').collection('products');
const ordersCol = client.db('ver2').collection('orders');

router.get('/:value', async (req, res, next) => {
  const result = await productCol.find({ name: { $regex: new RegExp(req.params.value) } }).sort( { name: 1 } ).toArray();

  const init = {
    result,
    filter: "search/" + req.params.value,
  }

  res.render('customerSearch.ejs', init);

});

async function query(value, sort) {
  console.log(sort);
  switch(sort) {
    case "name":
      return await productCol.find({ name: { $regex: new RegExp(value) } }).sort( { name: 1 } ).toArray();
    case "price":
      return await productCol.find({ name: { $regex: new RegExp(value) } }).sort( { price: 1 } ).collation({locale: "en_US", numericOrdering: true}).toArray();
    case "create":
      return await productCol.find({ name: { $regex: new RegExp(value) } }).sort( { iat: 1 } ).toArray();
  }
}

router.post('/:value', async (req, res, next) => {
  const bestSeller = req.body.bestSeller;
  const newProduct = req.body.newProduct;
  const sort = req.body.sort
  let minPrice = req.body.minPrice;
  let maxPrice = req.body.maxPrice;
  const result = await query(req.params.value, sort);
  if (!minPrice) {
    minPrice = 0;
  }
  if (!maxPrice) {
    maxPrice = Infinity;
  }

  let filterResult = result.map((doc) => {
    if (!bestSeller && !newProduct)
    {
      return doc;
    }

    if (doc.category == bestSeller) {
      if (doc.price >= minPrice && doc.price <= maxPrice) {
        return doc;
      }
    }
    if (doc.category == newProduct) {
      if (doc.price >= minPrice && doc.price <= maxPrice) {
        return doc;
      }
    }
  })
  filterResult = filterResult.filter(e => e)

  const init = {
    result: filterResult,
    filter: "search/" + req.params.value,
  }

  res.render('customerSearch.ejs', init);

});

module.exports = router;
