var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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


/*-----Connecting to db-------*/
var db = require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* --- V2: Adding Web Pages --- */
app.use('/about', aboutRouter);
app.use('./page', pageRouter);
/* ---------------------------- */

/* --- V3: Basic Template   --- */
app.use('/table', tableRouter);
app.use('/loops', loopsRouter);
/* ---------------------------- */

/* --- V4: Database Connect --- */
app.use('/select', selectRouter);
/* ---------------------------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
