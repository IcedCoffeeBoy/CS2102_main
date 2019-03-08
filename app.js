var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

/* --- V2: Adding Web Pages --- */
var aboutRouter = require('./routes/about');
var pageRouter = require('./routes/page');
/* ---------------------------- */

/* --- V3: Basic Template   --- */
var tableRouter = require('./routes/table');
var loopsRouter = require('./routes/loops');
/* ---------------------------- */

/* --- V4: Database Connect --- */
var selectRouter = require('./routes/select');
/* ---------------------------- */

/* --- V5: Adding Forms     --- */
var formsRouter = require('./routes/forms');
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var insertRouter = require('./routes/insert');
/* ---------------------------- */

var mainRouter = require('./routes/main');
var searchRouter = require('./routes/search');
// var searchItemRouter = require('./routes/search/items');
// var searchUserRouter = require('./routes/search/users');

var newlistingRouter = require('./routes/newlisting');

/* Add product page */
var productRouter = require('./routes/product');

/* -----Connecting to db------- */
var db = require('./db');
/* ---------------------------- */

//Passport auth
var userAuth = require('./userAuth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use the session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } //  30 days
}))
// Passport intialization
app.use(passport.initialize());
app.use(passport.session());

var initpassport = require('./initpassport');
initpassport();
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash("message");
  next();
})

app.use('/', indexRouter);

/* --- V2: Adding Web Pages --- */
app.use('/about', aboutRouter);
/* ---------------------------- */

/* --- V3: Basic Template   --- */
app.use('/table', tableRouter);
app.use('/loops', loopsRouter);
/* ---------------------------- */

/* --- V4: Database Connect --- */
app.use('/select', selectRouter);
/* ---------------------------- */

/* --- V5: Adding Forms     --- */
app.use('/forms', formsRouter);
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/insert', userAuth, insertRouter);
/* ---------------------------- */

// Ming Liang: To prevent unauthorised user entering the page, pls added userAuth before the router 

/* ------ Non-guide code  --- */
app.use('/main', mainRouter)
app.use('/search', searchRouter);
// app.use('/search/items', searchItemRouter);
// app.use('/search/users', searchUserRouter);
app.use('/user', userAuth, userRouter)
app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

app.use('/newlisting', userAuth, newlistingRouter);

app.use('/p', productRouter);

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
