var passport = require('passport');

module.exports = function(req,res,next){
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("Please login to use this function")
        return res.redirect('./');
    }
}

