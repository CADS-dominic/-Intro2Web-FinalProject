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
      if (brand.length === brandName.length) {
        brand = brand.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        })
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
