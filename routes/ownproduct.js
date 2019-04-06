var express = require("express");
var router = express.Router();
var db = require("../db");
var sql = require('../sql/index');

router.get("/", function (req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", async (req, res, next) => {

  let itemid = req.params.productId;
  let userid;

  // SQL Query Parallel Execution
  try {
    let promises = [
      db.db_promise(sql.sql_getProductInfo, [itemid]),
      db.db_promise(sql.sql_getProductImg, [itemid]),
      db.db_promise(sql.sql_getSellerReview, [itemid]),
      db.db_promise(sql.sql_getNoBidders,[itemid]),
      db.db_promise(sql.sql_getSoldInfo, [itemid])
    ]

    let results = await Promise.all(promises)
    let options = { year: 'numeric', month: 'long', day: 'numeric' }
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
      productId: itemid,
      noOfbidders: results[3][0].counts,
      user: req.user,
      sold: results[4][0],
      options: options
    });
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

  if (req.isAuthenticated()) {
    userid = req.user.id;
    db.query(sql.sql_insertview, [itemid, userid], (err, data) => {
      if (err) {
        console.log("SQL error inserting view " + err);
      }
    });
  }
});


router.post("/:productId/acceptoffer", async function (req, res, next) {

  if (!req.isAuthenticated()) {
    return res.sendStatus(403);
  }

  let itemid = req.params.productId;
  try {
    let rid = await db.db_promise(sql.sql_insertTran, [itemid])
    if (rid == 0) {
      return res.sendStatus(404);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
})


router.get("/:productId/getbiddinghistory", async function (req,res,next){

  console.log("API for bidding history used!")
  
  if (!req.isAuthenticated()) {
    console.log("user is not authericated")
    return res.sendStatus(403);
  }

  let userid = req.user.id;
  let itemid= req.params.productId;

  // Verify user is the seller
  let sellerRows = await db.db_promise(sql.sql_getSellerId,[itemid]);
  let sellerid = sellerRows[0].seller;
  if(sellerid != userid){
    console.log("user is not seller")
    return res.sendStatus(403);
  }

  let bidData = await db.db_promise(sql.sql_getBiddingHistory,[itemid]);

  res.send(bidData);

})

router.post("/:productId/review", async function (req, res, next) {
  /*--------------------- SQL Query Statement -------------------*/
  res.sendStatus(404);
  /* ---------------------------------------------------------- */

})

module.exports = router;
