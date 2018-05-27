var express = require("express");
var router = express.Router();
var passport= require("../config/passport");

//Home
router.get("/",function(req,res){
    res.render("home/main");
});
//Login
router.get("/login",function(req,res){
    res.render("home/login");
});
module.exports=router;