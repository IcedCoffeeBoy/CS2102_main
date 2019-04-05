/* -----------------Imports---------------- */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('cookie-session');
var flash = require('connect-flash');
require('dotenv').load()
var db = require('./db');
var initpassport = require('./initpassport');


// View routes 
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var mainRouter = require('./routes/main');
var searchRouter = require('./routes/search');
// var searchItemRouter = require('./routes/search/items');
// var searchUserRouter = require('./routes/search/users');
var newlistingRouter = require('./routes/newlisting');
var productRouter = require('./routes/product');
var chatRouter = require('./routes/chat');
var ownproductRouter = require('./routes/ownproduct');
var reviewRouter = require('./routes/review');
var userAuth = require('./userAuth');

var app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/p', express.static(path.join(__dirname, 'public')))
app.use('/op', express.static(path.join(__dirname, 'public')))
app.use('/search', express.static(path.join(__dirname, 'public')))
app.use('/review', express.static(path.join(__dirname, 'public')))

/* Using cookie session */
app.use(session({
  name: 'session',
  keys: ['cs2102'],
  // Cookie Options
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}))


/* Passport intialization */
app.use(passport.initialize());
app.use(passport.session());
initpassport();

/* Flash connect  */
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash("message");
  next();
})

/* To handle post request  */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/*----------Routes-----------------*/
app.use('/', indexRouter);
app.use('/main', mainRouter)
app.use('/search', searchRouter);
app.use('/newlisting', userAuth, newlistingRouter);
app.use('/p', productRouter);
app.use('/op', ownproductRouter);
// app.use('/search/items', searchItemRouter);
// app.use('/search/users', searchUserRouter);
app.use('/user', userAuth, userRouter);
app.use('/chat', chatRouter);
app.use('/review', reviewRouter);
app.get('/logout', function (req, res) {
  req.session = null;
  res.redirect('/');
});
/* ------------------------------- */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
