var db = require('../../db')

function connectDB(){
    db.connect(function (err) {
        if (err) {
           console.log(err)
           alert("unable to connect")
        }
        else {
            console.log("Sucessfully connected to database");
            alert("successfully connected!")
        }
    });

}

module.exports = connectDB
