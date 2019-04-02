var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/getChat', function (req, res, next) {
    res.render('chat', { user: req.user })
});

router.post('/sendChat', function (req, res, next) {
    let sender = req.user.id;
    let msg = req.body.msg;
    let rid = req.body.rid;

    res.render('chat', { user: req.user })
})

module.exports = router;
