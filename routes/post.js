var express = require("express");
var router = express.Router();
var passport= require("../config/passport");
var Post = require("../models/Post");


// Home
// 모르는거 물어보기
// post/show/5b3dee281a974a316ce63fc9
router.get("/show/:id",function(req,res){
    
    Post.findOne({_id:req.params.id},function(err,post){
        res.render("post/show",{
            user:req.user,
            post:post,
            id:req.params.id
        });
    })
});
router.get("/form",function(req,res){
    res.render("post/form");
});
//comment
// 
router.post("/show/:id",isLoggedin,function(req, res){
    var comment={};
    comment["username"] = req.user.username;
    comment["name"] = req.user.name;
    comment["comment"] = req.body.comment;
    comment["createdAt"] = new Date();
    console.log("새로 넣는 comment : "+ comment);
    Post.findOne({_id:req.params.id}, function(err, post){
        console.log(post);
        post.comments.push(comment);
        console.log(post);
        post.save();
        res.redirect('/post/show/'+req.params.id);
    });
});
router.get("/delete/:id/comment/:number",isLoggedin,function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
        console.log(post)
        if(post.comments[req.params.number].username==req.user.username)
        {
            post.comments.splice(req.params.number, 1);
        }
        post.save();
        console.log(req.params.id)
        res.redirect('/post/show/'+req.params.id);
    });
});

router.post("/star/:id",isLoggedin,function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
        post.star+=parseInt(req.body["star-input"]);
        post.starcnt++;
        
        post.save();
        res.redirect('/post/show/'+req.params.id);
    });
});
//new 글작성
router.get("/new", isMinju,function(req, res){//new를 받으면 post/form을 띄워준다 (주소는 /new)
    res.render("post/form");
});
// create
router.post("/new",isMinju, function(req, res){
    Post.create(req.body, function(err, post){
     if(err) return res.json(err);
     res.redirect("/");
   });
});
function isLoggedin(req,res,next){
    if(req.user){
        next();
    }
    else{
        req.flash("loginMsg","로그인 후 이용해 주세요.");
        res.redirect("/login");
    }
}
function isMinju(req,res,next){
    if(req.user && req.user.username=="min01134"){
        next();
    }
    else{
        req.flash("loginMsg","로그인 후 이용해 주세요.");
        res.redirect("/login");
    }
}
module.exports=router;