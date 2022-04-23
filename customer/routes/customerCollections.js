var express = require('express');
var client = require('../db');
var router = express.Router();
const brandCol = client.db('ver2').collection('brand');

const productCol = client.db('ver2').collection('products');

router.get('/', async (req, res, next) => {

  let brand = [];

  const brandName = await brandCol.find({}).toArray();

  const promise = new Promise((resolve, reject) => {
    brandName.forEach(async (doc, index) => {
      const products = await productCol.find({ brand: { $eq: doc.name } }).toArray();
      brand.push({
        ...doc,
        products
      })
      if (index === brandName.length - 1) {
        resolve(brand)
      }
    })
  })
  .then((brand) => {
    const init = {
      brand: brand,
    }
  
    res.render('customerCollections.ejs', init);
  })

});

module.exports = router;
