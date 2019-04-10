var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var path = require('path');
var multerGoogleStorage = require("../multer-google-storage");
var upload = multer({
  storage: multerGoogleStorage.storageEngine({
    filename: function (req, file, callback) {
      callback(null, req.user.username + "_" + Date.now() + path.extname(file.originalname));
    },
    keyFilename: "./keyfile.json"
  })
})
const sql = require('../sql/index');


router.get('/:productId', async function (req, res, next) {
  try {
    let results = await Promise.all([
      db.db_promise(sql.sql_getCategories, []),
      db.db_promise(sql.sql_getItemInfo, [req.params.productId]),
      db.db_promise(sql.sql_getProductImg, [req.params.productId])
    ]);
    res.render('editlisting', {
      title: 'Edit Listing',
      productId: req.params.productId,
      categoryData: results[0],
      item: results[1][0],
      imgurl: results[2],
      user: req.user
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});

router.post('/:productId/upload', upload.array('image', 4), async function (req, res, next) {
  let title = req.body.title;
  let description = req.body.description;
  let price = req.body.price;
  let category = req.body.category;
  let loanStart = req.body.loan_start;
  let loanEnd = req.body.loan_end;
  let  location = req.body.location;

  console.log(req.body)
  try {
    // Insert item entry
    let sqlInsertArgs = [title, description, price, category, loanStart, loanEnd, location, req.params.productId];
    var data = await db.db_promise(sql.sql_updateItem, sqlInsertArgs);

    // Insert image entries in parallel.
    // All SQL queries must be complete (via Promise.all) before this step is deemed successful.
    // let promises = req.files.map(async (img, idx) => {
    //   let imagePath = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/` + img.filename;
    //   db.db_promise(sql.sql_insertImage, [imagePath, data[0].itemid, idx]);
    // })
    // await Promise.all(promises);
  } catch (err) {
    console.log("SQL error when updating item.")
    res.sendStatus(404);
  }
  req.flash("message", "Sucessfully updated item.");
  res.redirect('/user');
})



router.post("/:productId/delete", async function (req, res, next) {

  try {
    let _ = await db.db_promise(sql.sql_deleteItem, [req.params.productId])
  } catch (err) {
    console.log("SQL error when deleting item.")
    res.sendStatus(404);
  }
  req.flash("message", "Sucessfully deleted item.");
  res.redirect('/user');
})


module.exports = router;
