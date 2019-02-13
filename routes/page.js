var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {  
  res.render('page', { title: 'Page', author: 'Ming Liang' });
});

module.exports = router;
