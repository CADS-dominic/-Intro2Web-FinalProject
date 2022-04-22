var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var passport = require('passport')
require('dotenv').config()
require('./routes/auth/passport')

var loginRouter = require('./routes/auth/login')
var signupRouter = require('./routes/auth/signup')
var forgotRouter = require('./routes/auth/forgot')
var adminRouter = require('./routes/admin/admin')
var accountRouter = require('./routes/admin/account')
var productRouter = require('./routes/admin/product')
var orderRouter = require('./routes/admin/order')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: process.env.PASSPORT_KEY || '19127426',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/', loginRouter)
app.use('/signup', signupRouter)
app.use('/forgot', forgotRouter)
app.use('/admin', adminRouter)
app.use('/account', accountRouter)
app.use('/product', productRouter)
app.use('/order', orderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
