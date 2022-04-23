var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash')
const session = require('express-session')
const db = require('./db/index')
const passport = require('passport')  
var expressLayouts = require('express-ejs-layouts');

const {ensureAuthenticated} = require('./config/auth')

require('dotenv').config()
require('./config/passport')(passport)

// var authRouter = require('./routes/auth');
// var adminRouter = require('./routes/admin');

var authNewRouter = require('./routes/authNew');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/customerUsers');
var collectionsRouter = require('./routes/customerCollections');
var aboutRouter = require('./routes/customerAbout'); 
var searchRouter = require('./routes/customerSearch');
var cartRouter = require('./routes/customerCart');
var detailRouter = require('./routes/customerDetail');

var app = express();

// Init Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Init Flash and locals variable
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user
    next()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect();



app.use('/views', express.static(path.resolve(__dirname, 'views')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));


app.use('/auth', authNewRouter)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/collections', collectionsRouter);
app.use('/about', aboutRouter);
app.use('/search', searchRouter);
app.use('/cart', cartRouter);
app.use('/detail', detailRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error.ejs');
});

module.exports = app;
