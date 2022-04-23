const express = require('express');
const router = express.Router();
const Products = require('../model/product')
const Users = require('../model/user')
const mongoose = require('mongoose');


router.get('/:id', function(req, res, next) {
  Products.findOne({_id: req.params.id})
    .then(pro => {
      var sameBrand = [];
      Products.find({brand: pro.brand})
        .then(pr => { sameBrand = pr; 
          res.render( 'customerDetail.ejs',{pro, sameBrand})
        })
    })
    .catch(next)
});

router.post('/add/:idpro-:iduser', function(req, res, next) {
  if(req.params.iduser === "guest") {
    res.redirect('/auth/login')
    return
  }

  Users.findById(req.params.iduser)
  .then((result) => {
    let productIndex = -1;
    result.cart.forEach((product, index) => {
      if(product.id == req.params.idpro) {
        result.cart[index].quantity = Number(result.cart[index].quantity) + Number(req.body.quantity)
        result.markModified('cart');
        productIndex = 1
        result.save()
        .then(() => res.redirect('back'))
        .catch(next)
        return;
      }
    })
    if(productIndex === -1) {
      result.cart.push({id: req.params.idpro, quantity: req.body.quantity})
      result.save()
      .then(() => res.redirect('back'))
      .catch(next)
    }
  })
});

router.post('/cmt/:name-:idpro-:iduser', function(req, res, next) {
  if(req.params.name === "guest") {
    res.redirect('/auth/login')
    return
  }

  const newCmt = {"index": mongoose.Types.ObjectId(), "name": req.params.name, "review": req.body.cmt, "user_id": req.params.iduser}
  Products.findOneAndUpdate({_id: req.params.idpro},  { $push: { comment: newCmt}})
    .then(() => res.redirect('back'))
    .catch(next)
});

router.get('/cmt/delete/:idpro-:rvw', function(req, res, next) {
  Products.findOneAndUpdate({_id: req.params.idpro}, {$pull: {comment: {review: req.params.rvw}}})
    .then(() => res.redirect('back'))
    .catch(next)
  });
  
router.post('/cmt/edit/:idpro-:rvw', function(req, res, next) {
Products.updateOne({_id: req.params.idpro, 'comment.review': req.params.rvw}, {'$set': {'comment.$.review': req.body.content}})
  .then(() => res.redirect('back'))
  .catch(next)
});
//

module.exports = router;
