var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/User");

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findOne({_id:id},function(err,user){
        done(err,user);
    });
});

passport.use("local-login",
    new LocalStrategy({
        usernameField : "username",
        passwordField : "password",
        passReqToCallbac : true
        },
        function(req, username, password, done){
            User.findOne({username:username})
            .select({password:1})
            .exec(function(err,user){
                if(err) return done(err);

                if(user&&user.authenticate(password)){
                    return done(null, user);
                } else{
                    req.flash("username",username);
                    req.flash("errors", {login:"Incorrect usename or password"});
                    return done(null, flase);
                }
            });
        }
    )
);

module.exports = passport;