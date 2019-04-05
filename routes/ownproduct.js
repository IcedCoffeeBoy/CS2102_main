var express = require("express");
var router = express.Router();
var db = require("../db");

router.get("/", function (req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", async (req, res, next) => {
  /* ------------------------- SQL QUERY STATEMENT------------------- */
  const mainquery =
    "select title, description, price, username, catname, accountid, sold from items join accounts on items.seller = accounts.accountid where itemid = $1";
  const imgquery = "select imgurl from images where itemid = $1";
  const revquery = "select review, username from ((reviews natural join transactions natural join relationships) A join accounts B on A.buyer = B.accountid) where itemid = $1";
  const sidequery = "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4";
  const sql_insertview = "insert into viewHistory(itemid,userid) values ($1,$2)"
  const sql_getNoBidder = "select count(distinct rid) as counts from bids natural join relationships where itemid=$1"
  const soldquery = "select buyer, username as buyername from (items join relationships on items.sold <> 0 and items.sold = relationships.rid) join accounts on buyer = accountid where items.itemid = $1"
  /* --------------------------------------------------------------- */

  let itemid = req.params.productId;
  let userid;

  // SQL Query Parallel Execution
  try {
    let promises = [
      db.db_promise(mainquery, [itemid]),
      db.db_promise(imgquery, [itemid]),
      db.db_promise(revquery, [itemid]),
      db.db_promise(sidequery),
      db.db_promise(sql_getNoBidder,[itemid]),
      db.db_promise(soldquery, [itemid])
    ]

    let results = await Promise.all(promises)

    // Avoid non-owner access the owner-product page
    if (results[0][0].accountid != req.user.id) {
      return res.sendStatus(404)
    }
    // Render page once all data is collected 
    res.render("ownproduct", {
      title: "productlisting",
      data: results[0][0],
      imgs: results[1],
      revs: results[2],
      recs: results[3],
      productId: itemid,
      noOfbidders: results[4][0].counts,
      user: req.user,
      sold: results[5][0]
    });
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

  if (req.isAuthenticated()) {
    userid = req.user.id;
    db.query(sql_insertview, [itemid, userid], (err, data) => {
      if (err) {
        console.log("SQL error inserting view " + err);
      }
    });
  }
});


router.post("/:productId/acceptoffer", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  const sql_insertTran = "select insertTransactionShortcut($1)"
  /* ---------------------------------------------------------- */
  if (!req.isAuthenticated()) {
    return res.sendStatus(403);
  }

  let itemid = req.params.productId;
  try {
    let rid = await db.db_promise(sql_insertTran, [itemid])
    if (rid == 0) {
      return res.sendStatus(404);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
})


router.get("/:productId/getbiddinghistory", async function (req,res,next){
  /* ------------------ SQL query ---------------------- */
  const sql_getsellerid = "select seller from items where itemid=$1"
  const get_biddinghistory = "select timestamp,amount from bids natural join relationships where itemid=$1 "
  /* -------------------------------------------------- */
  console.log("API for bidding history used!")
  
  if (!req.isAuthenticated()) {
    console.log("user is not authericated")
    return res.sendStatus(403);
  }

  let userid = req.user.id;
  let itemid= req.params.productId;

  // Verify user is the seller
  let sellerRows = await db.db_promise(sql_getsellerid,[itemid]);
  let sellerid = sellerRows[0].seller;
  if(sellerid != userid){
    console.log("user is not seller")
    return res.sendStatus(403);
  }

  let bidData = await db.db_promise(get_biddinghistory,[itemid]);

  res.send(bidData);

})

router.post("/:productId/review", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  res.sendStatus(404);
  /* ---------------------------------------------------------- */

})

module.exports = router;
