var express = require('express');
var router = express.Router();
const Users = require('../model/user')
const Orders = require('../model/order')
const Products = require('../model/product')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { ensureAuthenticated } = require('../config/auth')
const cloudinary = require('../config/cloudinary')
const nodemailer = require('nodemailer')



async function sendVerifyMail(email, url, token) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	})
	let info = await transporter.sendMail({
		from: 'SneakerJeeps@gmail.com',
		to: email,
		subject: 'Verify your mail',
		html:`
      <a href="${url}/auth/email-activate/${token}">Pleace click on given link to activate your account</a>
    `
    
	})
}

async function sendForgotMail(email, url, token) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	})
	let info = await transporter.sendMail({
		from: 'SneakerJeeps@gmail.com',
		to: email,
		subject: 'Reset Your Password',
		html:`
      <a href="${url}/auth/forgot/${token}/${email}">Click link to reset password</a>
    `
    
	})
}



router.get('/login', function (req, res, next) {
  res.render('./auth/login.ejs');
});
router.get('/register', function (req, res, next) {
  res.render('./auth/register.ejs');
});

router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body
  let errors = []

  if (!name || !email || !password) {
    errors.push('Please complete all fields')
  }
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
    errors.push('Please choose a more secure password.')
  }
  if (!name.match(/[a-zA-Z]{3,}(?: [a-zA-Z]+)?(?: [a-zA-Z]+)?$/)) {
    errors.push('Invalid fullname')
  }
  if (errors.length > 0) {
    res.render('./auth/register', { errors, name, email, password })
  }
  else {
    Users.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push('This email already exists')
          res.render('./auth/register', { errors, name, email, password })
        }
        else {
          const token = jwt.sign({ name, email, password }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' })
          
          sendVerifyMail(email, req.protocol + '://' + req.get('host'),token)

          req.flash('success_msg', 'Email has been sent, kindly activate your account')
          res.redirect('/auth/login')
        }

      })
      .catch(next)
  }

});


router.get('/email-activate/:tok', (req, res, next) => {
  const token = req.params.tok
  // console.log(token)
  if (token) {
    jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function (err, decodedToken) {
      if (err) {
        res.status(400).json({ error: 'Incorrect or expired link.' })
      } else {
        const { name, email, password } = decodedToken

        const { order, cart, ava, ban, iat, wallet } = { order: [], cart: [], ava: 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png', ban: false, iat: Date.now(), wallet: 10000 }
        const newUser = new Users({ name, email, password, order, cart, ava, ban, iat, wallet });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save()
              .then(() => {
                req.flash('success_msg', 'You have successfully registered and can login')
                res.redirect('/auth/login')
              })
              .catch(err => { error: "Error in sign up while account activation: " })
          })
        })
      }
    })
  } else {
    res.json({ error: 'Something went wrong!!!' })
  }
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  let errors = []
  if (!email || !password) {
    errors.push('Please complete all fields')
  }
  if (password.length < 6) {
    errors.push('Invalid Password')
  }
  if (errors.length > 0) {
    res.render('./auth/login', { errors, email, password })
  }
  else {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next)
  }
})

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'Bạn đã đăng xuất thành công');
  res.redirect('/')
})


router.get('/profile/:id', ensureAuthenticated, (req, res, next) => {
  Users.findById(req.params.id)
    .then(user => res.render('./auth/profile', { user }))
    .catch(next)
})
router.post('/profile/:id', ensureAuthenticated, (req, res, next) => {
  Users.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((user) => {
      res.redirect('back')
    })
    .catch(err => { })
})

router.get('/order/:id', ensureAuthenticated, (req, res, next) => {
  Users.findOne({ _id: req.params.id }, req.body)
    .then((user) => {
      Orders.find({ _id: { $in: user.order } })
        .then((result) => {
          result.forEach((doc) => {
            const date = new Date(Number(doc.iat));
            doc.iat = `${date.toLocaleTimeString("en-us")}     ${date.toLocaleDateString("en-us")}`
          })
          const init = {
            orderList: result,
          }
          res.render('./auth/order', init)
        })
    })
    .catch(err => {
      console.log(err);
    })
})

router.get('/order/:id/detail/:idOrder', ensureAuthenticated, (req, res, next) => {
  Orders.findOne({ _id: { $in: req.params.idOrder } })
    .then(async (result) => {
      const promise = new Promise((resolve, reject) => {
        const orderList = []
        result.productList.forEach((item, index) => {
          Products.findOne({ _id: item.id })
            .then((doc) => {
              orderList.push({
                quantity: item.quantity,
                name: doc.name,
                price: doc.price
              })
              if (orderList.length === result.productList.length) {
                resolve(orderList)
              }
            })
        })
      })
        .then((result) => {
          const init = {
            productList: result,
          }
          res.render('./auth/orderDetail', init)
        })


    })
    .catch(err => {
      console.log(err);
    })

})

router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function (req, res) {
    res.redirect('/home');
  });

router.get('/api/check-email-exist/:email', function (req, res, next) {
  Users.findOne({ email: req.params.email })
    .then(user => { res.json(!!user) })
    .catch(next)
});

router.get('/forgot', function (req, res, next) {
  res.render('./auth/forgot.ejs');
});
router.post('/forgot', function (req, res, next) {
  const email = req.body.email
  Users.findOne({ email: email })
    .then(user => {
      if (user) {
        const token = jwt.sign({ email }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' })
        sendForgotMail(email, req.protocol + '://' + req.get('host'),token)
        
        req.flash('success_msg', 'Email has been sent')
        res.redirect('/auth/forgot')

      }
      else {
        req.flash('error_msg', 'Email is not registered')
        res.redirect('/auth/forgot')
      }
    })
    .catch(next)
})

router.get('/forgot/:tkn/:eml', function (req, res, next) {
  res.render('./auth/inputNewPW.ejs', { email: req.params.eml });
});

router.post('/profile/pw/:id', ensureAuthenticated, (req, res, next) => {
  Users.findOne({ _id: req.params.id })
    .then(user => {
      if (user) {
        let errors = []
        let success_msg = []
        bcrypt.compare(req.body.curPassword, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                if (err) throw err
                Users.findOneAndUpdate({ _id: req.params.id }, { password: hash })
                  .then(() => {
                    success_msg.push('Change password successfully')
                    res.render('./auth/profile', { success_msg })
                  })
                  .catch(err => { })
              })
            })
          } else {
            errors.push('Your old password was entered incorrectly. Please enter it again.')
            res.render('./auth/profile', { errors })
          }
        })
      }
      else {
        res.send("This account does not exist")
      }
    })
    .catch(next)
})


router.post('/resetpw/:eml', (req, res, next) => {

  Users.findOne({ email: req.params.eml })
    .then(user => {

      if (user) {
        const { ePW, rePW } = req.body

        if (ePW === rePW) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(ePW, salt, (err, hash) => {
              if (err) throw err
              Users.findOneAndUpdate({ email: req.params.eml }, { password: hash })
                .then(() => {
                  req.flash('success_msg', 'Reset password successfully')
                  res.redirect('/auth/login')
                })
                .catch(err => { })
            })
          })
        } else {
          req.flash('error_msg', 'Please make sure both passwords match.')
          res.redirect('back')
        }
      } else {
        req.flash('error_msg', 'This email is not registered')
        res.redirect('/auth/forgot')
      }
    })
    .catch(next)
})

router.post('/imgAva', async (req, res, next) => {
  // res.send({email: req.body.email})

  const cloudinaryResponse = await cloudinary.uploader.upload(req.body.ava, {
    upload_preset: 'avatars',
  })

  Users.findOneAndUpdate({ email: req.body.email }, {ava: cloudinaryResponse.url})
    .then((user) => {
      req.flash('success_msg', "Image uploaded successfully")
      res.redirect('back')
    })
    .catch(err => { })
})

module.exports = router;