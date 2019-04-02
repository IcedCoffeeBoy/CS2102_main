var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/', async function (req, res, next) {
  const sqlquery = 'select itemid,title, description, price, imgurl from items natural join images where imgno = 0'
  
  /* The items are sorted by bids and followed by views */
  const sql_getpopularitems =
    'select r1.itemid,title,description,price,imgurl, count(distinct rid), count(distinct viewid) from (items natural join images) as r1 ' +
    'left join relationships on r1.itemid = relationships.itemid ' +
    'left join viewhistory on r1.itemid = viewhistory.itemid ' +
    'where imgno=0 and sold=false ' +
    'group by r1.itemid,title,description,price,imgurl ' +
    'order by count(rid) desc, count(viewid) desc';

  try {
    let data = await db.db_promise(sql_getpopularitems, null);
    res.render('main', { title: 'main', data: data, user: req.user });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
