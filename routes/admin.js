var express = require('express');
var router = express.Router();
var db = require('../db');


router.get('/', async function (req, res, next) {
    const sql_getallitems = 'select * from items';
    let userid = req.user.id;

    //Check if user is admin
    if (!db.db_checkadmin(userid)) {
        return res.sendStatus(403);
    }
    try {
        let item = await db.db_promise(sql_getallitems);
        res.render('admin', { user: req.user, item: item });
    } catch(err){
        console.log(err)
        res.sendStatus(500);
    }
})

router.get('/delete/:productId', async function (req, res, next) {
    const sql_checkadmin = "select 1 from accounts where accountid=$1 and admin=true";
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

module.exports = router;
