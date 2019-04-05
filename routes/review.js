var express = require("express");
var router = express.Router();
var db = require("../db");

router.get("/", function (req, res, next) {
    res.sendStatus(404);
});

router.post("/b:transactionId", async (req, res, next) => {
    /* ------------------------- SQL QUERY STATEMENT------------------- */
    const mainquery = "select * from (transactions natural join relationships) " + 
      "join accounts on accountid = seller " +
      "where transactionid = $1";
     /* --------------------------------------------------------------- */
  
    let reviewerid = req.user.id;
    let transactionId = req.params.transactionId;

    // SQL Query Parallel Execution
    try {
      let promises = [
        db.db_promise(mainquery, [transactionId]),
      ]
  
      let results = await Promise.all(promises)
  
      if (results[0][0].buyer != reviewerid) {
        return res.sendStatus(404)
      }
  
      // Render page once all data is collected 
      res.render("review", {
        title: "Review " + results[0][0].username,
        username: results[0][0].username,
        revieweeid: results[0][0].seller,
        submitreview: "b" + transactionId,
        user: req.user,
      });
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
});

router.post("/b:transactionId/submitreview", async function (req, res, next) {
    /*--------------------- SQL Query Statement -------------------*/
    const sql_insertReview = "select insertReviewShortcutB($1,$2,$3,$4)"
    /* ---------------------------------------------------------- */
    if (!req.isAuthenticated()) {
      return res.sendStatus(403);
    }
  
    let star = req.body.stars;
    let reviewtext = req.body.review;
    let transactionid = req.params.transactionId;
    let reviewerid = req.user.id;

    try {
      let rid = await db.db_promise(sql_insertReview, [star, reviewtext, transactionid, reviewerid])
    } catch (err) {
      return res.sendStatus(500); 
    }
    return res.sendStatus(200);
  })
  
router.post("/s:transactionId", async (req, res, next) => {
    /* ------------------------- SQL QUERY STATEMENT------------------- */
    const mainquery = "select * from (transactions natural join relationships) " + 
      "join accounts on accountid = buyer " +
      "where transactionid = $1";
     /* --------------------------------------------------------------- */
  
    let reviewerid = req.user.id;
    let transactionId = req.params.transactionId;

    // SQL Query Parallel Execution
    try {
      let promises = [
        db.db_promise(mainquery, [transactionId]),
      ]
  
      let results = await Promise.all(promises)
      
      if (results[0][0].seller != reviewerid) {
        return res.sendStatus(404)
      }
  
      // Render page once all data is collected 
      res.render("review", {
        title: "Review " + results[0][0].username,
        username: results[0][0].username,
        revieweeid: results[0][0].buyer,
        submitreview: "s" + transactionId,
        user: req.user,
      });
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
});

router.post("/s:transactionId/submitreview", async function (req, res, next) {
    /*--------------------- SQL Query Statement -------------------*/
    const sql_insertReview = "select insertReviewShortcutS($1,$2,$3,$4)"
    /* ---------------------------------------------------------- */
    if (!req.isAuthenticated()) {
      return res.sendStatus(403);
    }
  
    let star = req.body.stars;
    let reviewtext = req.body.review;
    let transactionid = req.params.transactionId;
    let reviewerid = req.user.id;

    try {
      let rid = await db.db_promise(sql_insertReview, [star, reviewtext, transactionid, reviewerid])
    } catch (err) {
      return res.sendStatus(500); 
    }
    return res.sendStatus(200);
  })

module.exports = router;