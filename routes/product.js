var express = require("express");
var router = express.Router();
var db = require("../db");

function db_query(sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, data) => {
      if (err) {
        console.log("SQL error:" + err);
        return reject(err);
      } else {
        resolve(data.rows);
      }
    })
  });
}

router.get("/", function(req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", function(req, res, next) {
  var mainquery =
    "select title, description, price, username, catname, accountid from items join accounts on items.seller = accounts.accountid where itemid = $1";
  var imgquery = "select imgurl from images where itemid = $1";
  var revquery = "select review, username from ((reviews natural join transactions natural join relationships) A join accounts B on A.buyer = B.accountid) where itemid = $1";
  var sidequery =
    "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4";
  
  var itemid = req.params.productId;
  var data = {};
  console.log()
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
        user: req.user
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
