var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function (req, res, next) {
    res.render('chat', { user: req.user })
})

module.exports = router;
