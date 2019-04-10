var express = require('express');
var router = express.Router();
var db = require('../db');


router.get('/', async function (req, res, next) {
    const sql_checkadmin = "select 1 from accounts where accountid=$1 and admin=true";
    const sql_getallitems='select * from items';

    let userid = req.user.id;
    let adminStatus = await db.db_promise_check(sql_checkadmin, [userid]);

    if (adminStatus == false) {
        res.sendStatus(403);
    }

    let item = await db.db_promise(sql_getallitems);

    res.render('admin', { user: req.user, item: item })
})

module.exports = router;
