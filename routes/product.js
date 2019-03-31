var express = require("express");
var router = express.Router();
var db = require("../db");

router.get("/", function (req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", async (req, res, next) => {
  /* ------------------------- SQL QUERY STATEMENT------------------- */
  const mainquery =
    "select title, description, price, username, catname, accountid from items join accounts on items.seller = accounts.accountid where itemid = $1";
  const imgquery = "select imgurl from images where itemid = $1";
  const revquery = "select review, username from ((reviews natural join transactions natural join relationships) A join accounts B on A.buyer = B.accountid) where itemid = $1";
  const sidequery =
    "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4";
  /* --------------------------------------------------------------- */
  
  let itemid = req.params.productId;

  // SQL Query Parallel Execution
  try {
    let promises = [
      db.db_promise(mainquery, [itemid]),
      db.db_promise(imgquery, [itemid]),
      db.db_promise(revquery, [itemid]),
      db.db_promise(sidequery)
    ]

    let results = await Promise.all(promises)

    // Render page once all data is collected 
    res.render("product", {
      title: "productlisting",
      data: results[0][0],
      imgs: results[1],
      revs: results[2],
      recs: results[3],
      productId: itemid,
      user: req.user
    });
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
});

router.post("/:productId/makebid", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  const sql_getuserid = "select seller from items where items.itemId=$1";
  const sql_formnewrelationship = "insert into relationships(seller,buyer,itemid) values ($1,$2,$3) on conflict do nothing returning rid ";
  const sql_getexistrid = "select rid from relationships where seller=$1 and buyer=$2 and itemid=$3"
  const sql_insertbid = "insert into bids(userid,rid,amount) values ($1,$2,$3)"
  const sql_setnewprice = "update items price set price=$1 where itemid=$2"
  /* ---------------------------------------------------------- */

  let itemid = req.params.productId;
  let bidPrice = req.body.bidPrice;
  let buyerId = req.user.id;

  try {
    let sellerRows = await db.db_promise(sql_getuserid, [itemid]);
    let sellerId = sellerRows[0].seller;

    let ridRows = await db.db_promise(sql_formnewrelationship, [sellerId, buyerId, itemid]);
    if (ridRows.length < 1) {
      ridRows = await db.db_promise(sql_getexistrid, [sellerId, buyerId, itemid]);
    }
    let rid = ridRows[0].rid;

    let parallel = [db.db_promise(sql_insertbid, [buyerId, rid, bidPrice]),db.db_promise(sql_setnewprice, [bidPrice, itemid])];
    await Promise.all(parallel);
  } catch (err) {
    res.sendStatus(500);
  }
  res.sendStatus(200);
})


router.post("/:productId/review", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  res.sendStatus(404);
  /* ---------------------------------------------------------- */

})





module.exports = router;
