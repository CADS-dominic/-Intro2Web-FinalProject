var express = require('express');
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
var client = require('../db');
var router = express.Router();

const brandCol = client.db('ver2').collection('brand');

const productCol = client.db('ver2').collection('products');


/* GET home page. */
router.get('/', async (req, res, next) => {

  let idList = [];
  const bestSeller = [];
  const newProduct = [];
  const brand = [];
  const product = [];

  await productCol.find({category: {$eq: "Best Seller"}}).forEach((doc) => {
    bestSeller.push(doc);
  });

  await productCol.find({category: {$eq: "New Product"}}).forEach((doc) => {
    newProduct.push(doc);
  });

  await brandCol.find({}).forEach((doc) => {
    brand.push(doc);
  });

  const init = {
    bestSeller: bestSeller,
    newProduct: newProduct,
    brand: brand,
  };

  res.render('index.ejs', init);
});

router.get('/getProducts', async (req, res) => {
  let productList = [];
  await productCol.find({}).forEach((doc) => {
    productList.push(doc);
  });
  res.status(200).json(productList);
});

module.exports = router;
