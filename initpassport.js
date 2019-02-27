var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var bcrypt = require('bcrypt');

module.exports = function () {
    passport.use('local', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    },
        function (req, username, password, done) {
            console.log('called local');
            var sqlquery = "select * from accounts where username=$1";
            db.query(sqlquery, [username], (err, data) => {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    if (data.rowCount == 1) {
                        hash = data.rows[0].password;
                        bcrypt.compare(password, hash, function (err, res) {
                            if (res == true) {
                                console.log('match!')
                                var user = data.rows[0]
                                done(null, user);
                            } else {
                                done(null, false, req.flash("message", "Incorrent password!"))
                            }
                        });
                    } else {
                        done(null, false, req.flash("message", "Incorrent username or password!"));
                    }
                }
            })
        }
    )
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}