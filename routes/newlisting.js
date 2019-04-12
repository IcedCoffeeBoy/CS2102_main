var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var path = require('path');
if (process.env.GCLOUD_PROJECT) {
  var multerGoogleStorage = require("../multer-google-storage");
  var upload = multer({
    storage: multerGoogleStorage.storageEngine({
      filename: function (req, file, callback) {
        callback(null, req.user.username + "_" + Date.now() + path.extname(file.originalname));
      },
      keyFilename: "./keyfile.json"
    })
  })
  var pathfile = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/`
} else {
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/uploads');
    },
    filename: function (req, file, callback) {
      callback(null, req.user.username + "_" + Date.now() + path.extname(file.originalname));
    }
  })
  var upload = multer({ storage: storage })
  var pathfile = 'images/uploads/' 
}


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
  let seller = req.user.id;
  let title = req.body.title;
  let description = req.body.description;
  let price = req.body.price;
  let category = req.body.category;
  let loanStart = req.body.loan_start;
  let loanEnd = req.body.loan_end;
  let location = req.body.location;

  try {
    // Insert item entry
    let sqlInsertArgs = [title, description, price, seller, category, loanStart, loanEnd, location];
    var data = await db.db_promise(sql.sql_insertItem, sqlInsertArgs);

    // Insert image entries in parallel.
    // All SQL queries must be complete (via Promise.all) before this step is deemed successful.
    let promises = req.files.map(async (img, idx) => {
        let imagePath = pathfile + img.filename;
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
