var express = require('express');
var router = express.Router();
var db = require('../db');
var editproductRouter = require('./editlisting');


router.get('/', async function (req, res, next) {
    const sql_getallitems = 'select * from items order by itemid';
    const sql_getallusers = "select * from accounts order by accountid"

    //Check if user is admin
    if (!req.user) {
        return res.sendStatus(403);
    }
    let userid = req.user.id;
    let result = await db.db_checkadmin(userid);

    if (result == false) {
        return res.sendStatus(403);
    }

    try {
        let item = await db.db_promise(sql_getallitems);
        let users = await db.db_promise(sql_getallusers);
        res.render('admin', { user: req.user, item: item, users: users });
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.get('/delete/:productId', async function (req, res, next) {
    const sql_delitem = "delete from items where itemid=$1"

    let userid = req.user.id;
    let itemid = req.params.productId;

    try {
        //Check if user is admin
        if (!db.db_checkadmin(userid)) {
            return res.sendStatus(403);
        }
        await db.db_promise(sql_delitem, [itemid]);
    } catch (err) {
        console.log("Error deleting item " + err);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
})

router.get('/deleteuser/:deluserid', async function (req, res, next) {
    const sql_deluser = "delete from accounts where accountid=$1"

    let userid = req.user.id;
    let deluserid = req.params.deluserid;

    try {
        //Check if user is admin
        if (!db.db_checkadmin(userid)) {
            console.log("user not admin")
            return res.sendStatus(403);
        }
        await db.db_promise(sql_deluser, [deluserid]);
    } catch (err) {
        console.log("Error deleting item " + err);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
})

router.use('/p', checkAdmin, editproductRouter);


function checkAdmin(req, res, next) {
    if (req.user == null) {
        return res.sendStatus(403);
    }
    let userid = req.user.id;
    //Check if user is admin
    if (db.db_checkadmin(userid)) {
        return next();
    } else {
        return res.sendStatus(403);
    }
}

module.exports = router;
