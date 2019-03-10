var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var path = require('path');

var sqlQuery = 'SELECT * FROM Categories;'

router.get('/', function (req, res, next) {
  db.query(sqlQuery, (err, categoryData) => {
    if (err) {
      console.log(err);
    } else {
      res.render('newlisting', {title: 'New Listing', categoryData: categoryData.rows, user: req.user});
    }
  })
});


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, 'public/images/uploads');
  },
  filename: function(req, file, callback) {
      callback(null, req.user.username + "_" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({storage: storage}).array('image',4);


router.post('/upload', function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    } else {
      var title = req.body.title;
      var description = req.body.description;
      var price = req.body.price;
      var category = req.body.category;
      var seller = req.user.id;
      console.log(req.body);
      
      var sql_insertItem = "INSERT INTO Items(title,description,price,seller,catname) VALUES ($1,$2,$3,$4,$5) RETURNING itemid";
      var sql_insertImage = "INSERT INTO Images(imgurl,itemid,imgno) VALUES ($1,$2,$3)";
    
      db.query(sql_insertItem, [title, description, price, seller, category], function (err, data) {
        if (err) {
          console.log(err);
        } else {
          for (var i=0; i<req.files.length; i++) {
            var imagePath = 'images/uploads/' + req.files[i].filename;
            db.query(sql_insertImage, [imagePath, data.rows[0].itemid, i], function(err, data) {
              if (err) {
                console.log(err);
                res.json({message: 'Error encountered :(', success: false});
              } else {
                res.redirect('/user');
              }
            })
          }
        }
      })
    }
  });
});

module.exports = router;
