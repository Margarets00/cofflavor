var express = require("express");
var router = express.Router();
var passport= require("../config/passport");
var Post     = require("../models/Post");

//Home
router.get("/",function(req,res){
    Post.find({},function(err,Post){
        if(err) return console.log(err);
        console.log("post : "+ Post);
        res.render("home/main",{Post:Post});
    });    
});
// Login // 2
router.get("/login", function (req,res) {// /login 을 받으면 유저네임과 에러를 만들어두고 렌더링 해준다.
    var username = req.flash("username")[0]|| "";
    var errors = req.flash("errors")[0] || {};
    var loginMsg = req.flash("loginMsg")[0] || "";
    res.render("home/login", {
     username:username,
     errors:errors,
     loginMsg:loginMsg
    });
});  

// Post Login // 3
router.post("/login",
    function(req,res,next){
        var errors = {};
        var isValid = true;
        if(!req.body.username){
            isValid = false;
            errors.username = "유저네임이 잘못된것 같은데용?";
        }
        if(!req.body.password){
            isValid = false;
            errors.password = "비밀번호가 잘못된것 같은데용?";//똥꼬발랄한거봐랔ㅋㅋㅋㅋㅋ
        }

        if(isValid){
            next();
        } else {
            req.flash("errors",errors);
            res.redirect("/login");
        }
    },
    passport.authenticate("local-login", {
        successRedirect : "/",
        failureRedirect : "/login"
    }
));
// Logout // 4
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});
// show
router.get("/:id", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
     if(err) return res.json(err);
     res.render("post/show", {post:post});
    });
});
//destroy
router.delete("/:id", function(req, res){
    Contact.remove({_id:req.params.id}, function(err){
     if(err) return res.json(err);
     res.redirect("/");
    });
});




module.exports=router;