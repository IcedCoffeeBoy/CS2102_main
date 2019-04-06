var express = require("express");
var router = express.Router();
var db = require("../db");
var sql = require("../sql/index");

router.get("/", function (req, res, next) {
    res.sendStatus(404);
});

router.post("/b:transactionId", async (req, res, next) => {
  
    let reviewerid = req.user.id;
    let transactionId = req.params.transactionId;

    // SQL Query Parallel Execution
    try {
      let promises = [
        db.db_promise(sql.sql_reviewPageB, [transactionId]),
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

    if (!req.isAuthenticated()) {
      return res.sendStatus(403);
    }
  
    let star = req.body.stars;
    let reviewtext = req.body.review;
    let transactionid = req.params.transactionId;
    let reviewerid = req.user.id;

    try {
      let rid = await db.db_promise(sql.sql_insertReviewB, [star, reviewtext, transactionid, reviewerid])
    } catch (err) {
      return res.sendStatus(500); 
    }
    return res.sendStatus(200);
  })
  
router.post("/s:transactionId", async (req, res, next) => {
  
    let reviewerid = req.user.id;
    let transactionId = req.params.transactionId;

    // SQL Query Parallel Execution
    try {
      let promises = [
        db.db_promise(sql.sql_reviewPageS, [transactionId]),
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

    if (!req.isAuthenticated()) {
      return res.sendStatus(403);
    }
  
    let star = req.body.stars;
    let reviewtext = req.body.review;
    let transactionid = req.params.transactionId;
    let reviewerid = req.user.id;

    try {
      let rid = await db.db_promise(sql.sql_insertReviewS, [star, reviewtext, transactionid, reviewerid])
    } catch (err) {
      return res.sendStatus(500); 
    }
    return res.sendStatus(200);
  })

module.exports = router;