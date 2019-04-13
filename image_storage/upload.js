var multer = require('multer');
var path = require('path');

if (process.env.GCLOUD_PROJECT) {
    var multerGoogleStorage = require("./multer-google-storage");
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

  module.exports = {
      upload: upload,
      pathfile: pathfile
  }
  
  
