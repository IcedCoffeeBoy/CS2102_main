var express = require('express');
var router = express.Router();
var db = require('../db');
var editproductRouter = require('./editlisting');


router.get('/', async function (req, res, next) {
    const sql_getallitems = 'select * from items';
    const sql_getallusers = "select * from accounts"
    let userid = req.user.id;
    
    //Check if user is admin
    if (!db.db_checkadmin(userid)) {
        return res.sendStatus(403);
    }
    try {
        let item = await db.db_promise(sql_getallitems);
        let user = await db.db_promise(sql_getallusers);
        res.render('admin', { user: req.user, item: item, user: req.user });
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

router.use('/p', checkAdmin, editproductRouter);


function checkAdmin(req, res, next) {
    if(req.user==null){
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
