var express = require("express");
var router = express.Router();
var db = require("../db");

router.get("/", function(req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", function(req, res, next) {
  var mainquery =
    "select title, description, price, username from items natural join accounts where itemid = $1";
  var imgquery = "select imgurl from images where itemid = $1";
  var sidequery =
    "select itemid, title, description, price, imgurl from items natural join images";
  var reviewquery = "select review from "
  var itemid = req.params.productId;
  var data = {};
  db.query(mainquery, [itemid], function(err, maindata) {
    if (err) {
      console.log("SQL error:" + err);
    } else {
      db.query(imgquery, [itemid], (err, mainimg) => {
        if (err) {
          console.log("SQL error:" + err);
        } else {
          db.query(sidequery, (err, mainrecs) => {
            if (err) {
              console.log(err);
            } else {
              res.render("product", {
                title: "productlisting",
                data: maindata.rows[0],
                imgs: mainimg.rows,
                recs: mainrecs.rows,
                user: req.user,
                tparam: req.params.productId
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
