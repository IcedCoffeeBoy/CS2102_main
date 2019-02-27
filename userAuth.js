var passport = require('passport');

module.exports = function(req,res,next){
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        return next();
    } else {
        return res.redirect('./');
    }
}

