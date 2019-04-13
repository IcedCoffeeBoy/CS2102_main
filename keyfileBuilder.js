var fs = require("fs");

makeKeyfileJson = (keyfilePath) => {
  // Begin building only if no existing keyfile is found
  fs.access(keyfilePath, fs.F_OK, (err) => {
    if (err) {
      var encoded = process.env.ENCODED_GOOGLE_CREDENTIALS
      if (!encoded) {
          console.log("Warning: Could not find credentials environment variable! Google cloud storage not available")
          return
      }
      var decoded = Buffer.from(encoded, 'base64').toString('binary');
      fs.writeFileSync(keyfilePath, decoded);
      return
    }
  })
}

module.exports = makeKeyfileJson;