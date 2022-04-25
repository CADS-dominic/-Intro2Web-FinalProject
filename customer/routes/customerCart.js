var express = require('express');

const { ObjectId } = require('mongodb');
var client = require('../db');
var router = express.Router();

const userCol = client.db('ver2').collection('users');
const productCol = client.db('ver2').collection('products');
const ordersCol = client.db('ver2').collection('orders');
let productOrder = [];

router.get('/:id', async (req, res, next) => {

  let cart = [];
  let cartList = [];
  let wallet;

  await userCol.findOne({ _id: { $eq: ObjectId(req.params.id) } }).then((doc) => {
    cartList = doc.cart;
    wallet = doc.wallet;
  });

  cartList = cartList.sort((a, b) => {
    return a.quantity - b.quantity;
  });

  const promise = new Promise((resolve, reject) => {
    if (cartList.length == 0) reject();
    cartList.forEach(async (doc, index) => {
      await productCol.findOne({ _id: { $eq: ObjectId(doc.id) } })
        .then((product) => {
          cart.push({
            product,
            quantity: doc.quantity
          })
          if (cart.length == cartList.length) {
            cart = cart.sort((a, b) => {
              return a.quantity - b.quantity;
            });
            resolve(cart)
          }
        })

    })
  })
    .then((cart) => {
      const total = cart.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0);
      const init = {
        cart,
        total,
        wallet,
        notify: "",
      }
      productOrder = {
        cartList,
        total,
        wallet
      }
      res.render('customerCart.ejs', init);
    })
    .catch((err) => {
      const init = {
        cart: [],
        total: 0,
        wallet,
        notify: "",
      }
      res.render('customerCart.ejs', init);
    })

});

router.post('/checkout/:id', async (req, res, next) => {
  let orderId = null;
  let newWallet = null;
  await userCol.findOne({ _id: { $eq: ObjectId(req.params.id) } })
    .then((doc) => {
      if (req.body.address == "")
      {
        const notify = "Please enter your address";
        res.send({ notify });
        return;
      }
      newWallet = Number(doc.wallet) - Number(productOrder.total)
      if (newWallet < 0) {
        const notify = "Not enough money in wallet";
        res.send({ notify });
        return;
      }
      else {
        ordersCol.insertOne({
          address: req.body.address,
          totalPrice: productOrder.total,
          productList: productOrder.cartList,
          status: "pending",
          iat: Date.now(),
        })
          .then(async (doc) => {
            orderId = doc.insertedId;
            await userCol.findOneAndUpdate({ _id: { $eq: ObjectId(req.params.id) } },
              { $push: { "order": orderId }, $set: { "cart": [], "wallet": newWallet } })
              .then(() => {
                const notify = "Order success";
                res.send({ notify })
              })
          });
      }
    });
});

router.post('/:id/minus-:index', async (req, res, next) => {
  let cart = [];
  let cartList = [];

  await userCol.findOne({ _id: { $eq: ObjectId(req.params.id) } }).then((doc) => {
    cartList = doc.cart;
  });

  cartList = cartList.sort((a, b) => {
    return a.quantity - b.quantity;
  });

  cartList[req.params.index].quantity = Number(cartList[req.params.index].quantity) - 1;
  cartUpdate = [
    ...cartList,
  ]

  if (cartUpdate[req.params.index].quantity <= 0) {
    cartUpdate.splice(req.params.index, 1);
  }

  await userCol.updateOne({ _id: ObjectId(req.params.id) }, { $set: { "cart": cartUpdate } })

  const promise = new Promise((resolve, reject) => {
    if (cartList.length == 0) reject();
    cartList.forEach(async (doc, i) => {
      await productCol.findOne({ _id: { $eq: ObjectId(doc.id) } })
        .then((product) => {
          cart.push({
            product,
            quantity: doc.quantity
          })
          if (cart.length == cartList.length) {
            cart = cart.sort((a, b) => {
              return a.quantity - b.quantity;
            });
            resolve(cart)
          }
        })
    })
  })
    .then((cart) => {
      const total = cart.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0);
      const init = {
        cart,
        total
      }
      productOrder = {
        cartList,
        total
      }
      res.send(init);
    })
    .catch((err) => {
      const init = {
        cart: [],
        total: 0
      }
      res.send(init);
    })
});

router.post('/:id/plus-:index', async (req, res, next) => {
  let cart = [];
  let cartList = [];

  await userCol.findOne({ _id: { $eq: ObjectId(req.params.id) } }).then((doc) => {
    cartList = doc.cart;
  });

  cartList = cartList.sort((a, b) => {
    return a.quantity - b.quantity;
  });

  cartList[req.params.index].quantity = Number(cartList[req.params.index].quantity) + 1;

  await userCol.updateOne({ _id: ObjectId(req.params.id) }, { $set: { "cart": cartList } })

  const promise = new Promise((resolve, reject) => {
    if (cartList.length == 0) reject();
    cartList.forEach(async (doc, i) => {
      await productCol.findOne({ _id: { $eq: ObjectId(doc.id) } })
        .then((product) => {
          cart.push({
            product,
            quantity: doc.quantity
          })
          if (cart.length == cartList.length) {
            cart = cart.sort((a, b) => {
              return a.quantity - b.quantity;
            });
            resolve(cart)
          }
        })
    })
  })
    .then((cart) => {
      const total = cart.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0);
      const init = {
        cart,
        total
      }
      productOrder = {
        cartList,
        total
      }
      res.send(init);
    })
    .catch((err) => {
      const init = {
        cart: [],
        total: 0
      }
      res.send(init);
    })
});

module.exports = router;
