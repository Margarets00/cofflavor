var express  = require("express");
var router   = express.Router();
var User     = require("../models/User");
var passport= require("../config/passport");

//New 회원가입 창
router.get("/new", function(req, res){
    var user = req.flash("user")[0] || {};
    var errors = req.flash("errors")[0] || {};
    res.render("users/new", { user:user, errors:errors });
});
// create 회원정보 입력후 메인 페이지로 이동
// 똑바로 알아야된다고 이거
// 여기 경로가 어딘줄 제대로 아냐?

//어디로 접속해야 일로 오는거야 말해봐 /new라고? 씨발 틀렸어 이새1끼야 ㅂㄷㅂㄷㅂㄷㅂㄷㅂㄷㅂusers/new
// ㅇㅇ users/new로 해야 일로 옴;; 왜그런지 말해보고 아까 왜 회원가입창에단 /new만 썼는지도 말ㅇ봐 가끔 ㅆㅃ 이거랑 너무헷갈려서 
// routes -> 에는 /users/~~~블라블라 이런애들단위로 나눌려고 만든거라서
// useㅅㅂrs/neㅇㅜw 이렇게 ㅇ들어가게되는거임;

/**
 * 1. /users/new (GET) 의 html에서 login form 에 user가 정보 입력.
 * 2. /users/new (POST) 로 모든 정보 전송.
 * 3. req.body.~~~~에 form의 name속성에 알맞게 다 정보가 들어옴. <- 여기까지 ㅇㅋ? 웅..
 * 
 */
router.post("/new", function(req, res){
  console.log(req.body);
  User.create(req.body, function(err, user){
   if(err){
    req.flash("user", req.body);
    req.flash("errors", parseError(err)); 
    console.log(parseError(err))
    return res.redirect("/users/new");//users/new <-
   }
   res.redirect("/login");
  });
 });


 function parseError(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
     for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
     }
  } else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
     parsed.username = { message:"This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}//이거 왜 복붙안했었음...? 저거 필요한지 몰랐어..


module.exports = router;