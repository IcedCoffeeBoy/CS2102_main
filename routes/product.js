var express = require("express");
var router = express.Router();
var db = require("../db");

function db_query(sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, data) => {
      if (err) {
        console.log("SQL error:" + err);
        console.log(err)
        return reject(err);
      } else {
        resolve(data.rows);
      }
    })
  });
}
router.get("/", function (req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", function (req, res, next) {
  var mainquery =
    "select title, description, price, username, catname, accountid from items join accounts on items.seller = accounts.accountid where itemid = $1";
  var imgquery = "select imgurl from images where itemid = $1";
  var revquery = "select review, username from ((reviews natural join transactions natural join relationships) A join accounts B on A.buyer = B.accountid) where itemid = $1";
  var sidequery =
    "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4";

  var itemid = req.params.productId;
  var data = {};

  db_query(mainquery, [itemid])
    .then((rows) => {
      data.main = rows[0];
      console.log("test" + data.main);
      return db_query(imgquery, [itemid])
    })
    .then((rows) => {
      data.imgs = rows;
      return db_query(revquery, [itemid])
    })
    .then((rows) => {
      data.reviews = rows;
      return db_query(sidequery)
    })
    .then((rows) => {
      data.recomms = rows;
      res.render("product", {
        title: "productlisting",
        data: data.main,
        imgs: data.imgs,
        revs: data.reviews,
        recs: data.recomms,
        productId: itemid,
        user: req.user
      });
    })
    .catch(err => console.log(err));
});

router.post("/:productId/makebid", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  var getUserId = "select seller from items where items.itemId=$1";
  var newRelationship = "insert into relationships(seller,buyer,itemid) values ($1,$2,$3) on conflict do nothing returning rid ";
  var findExistRid = "select rid from relationships where seller=$1 and buyer=$2 and itemid=$3"
  var insertBid = "insert into bids(userid,rid,amount) values ($1,$2,$3)"
  var setNewPrice = "update items price set price=$1 where itemid=$2"
  /* ---------------------------------------------------------- */

  var itemid = req.params.productId;
  var bidPrice = req.body.bidPrice;
  var buyerId = req.user.id;
  try {
    var sellerRows = await db_query(getUserId, [itemid]);
    var sellerId = sellerRows[0].seller;

    var ridRows = await db_query(newRelationship, [sellerId, buyerId, itemid]);
    if (ridRows.length < 1) {
      ridRows = await db_query(findExistRid, [sellerId, buyerId, itemid]);
    }
    var rid = ridRows[0].rid;

    await db_query(insertBid, [buyerId, rid, bidPrice]);
    await db_query(setNewPrice, [bidPrice, itemid]);
  } catch (err) {
    res.sendStatus(404);
  }
  req.flash("successfully bidded");
  res.sendStatus(200);
})

module.exports = router;
