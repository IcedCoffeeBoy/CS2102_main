var express = require('express');
var router = express.Router();
var loopsRouter = require('./loops');

router.get('/', function(req, res, next) {
  res.render('table', { title: 'Table' });
});

router.use('/loops', loopsRouter);

module.exports = router;
