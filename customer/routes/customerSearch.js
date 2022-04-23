var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  const result= [
    {
      img: "../public/images/3.jpg",
      price: "1000$",
      name: "Adidas Prophere",
      discount: "8%",
    }, 
    {
      img: "../public/images/4.jpg",
      price: "2000$",
      name: "Gucci",
      discount: "12%",
    }, 
    {
      img: "../public/images/5.jpg",
      price: "2000$",
      name: "Dior",
      discount: "15%",
    },
    {
      img: "../public/images/6.jpg",
      price: "2000$",
      name: "Stan Smith",
      discount: "12%",
    },
    {
      img: "../public/images/7.jpg",
      price: "2000$",
      name: "Converse",
      discount: "15%",
    },
  ]

  const init = {
    result,
  }

  res.render('customerSearch.ejs', init);

});

module.exports = router;
