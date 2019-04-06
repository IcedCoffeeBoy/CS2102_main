var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, req.user.username + "_" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage })
const sql = require('../sql/index');

router.get('/', async function (req, res, next) {
  try {
    let categoryData = await db.db_promise(sql.sql_getCategories);
    res.render('newlisting', { title: 'New Listing', categoryData: categoryData, user: req.user });   
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});

router.post('/upload', upload.array('image', 4), async function (req, res, next) {
  var seller = req.user.id;
  var title = req.body.title;
  var description = req.body.description;
  var price = req.body.price;
  var category = req.body.category;
  var loanStart = req.body.loan_start;
  var loanEnd = req.body.loan_end;
  var location = req.body.location;
  console.log(req.body);

  try {
    // Insert item entry
    let sqlInsertArgs = [title, description, price, seller, category, loanStart, loanEnd, location];
    var data = await db.db_promise(sql.sql_insertItem, sqlInsertArgs);

    // Insert image entries in parallel.
    // All SQL queries must be complete (via Promise.all) before this step is deemed successful.
    let promises = req.files.map(async (img, idx) => {
      let imagePath = 'images/uploads/' + img.filename;
      db.db_promise(sql.sql_insertImage, [imagePath, data[0].itemid, idx]);
    })
    await Promise.all(promises);
  } catch (err) {
    console.log("SQL error when inserting item.")
    res.sendStatus(404);
  }
  req.flash("message", "Sucessfully added item.");
  res.redirect('/user');
})

module.exports = router;
