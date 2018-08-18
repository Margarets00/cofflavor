//index.js

var express        = require("express");
var methodOverride = require("method-override");
var mongoose       = require("mongoose");
var session        = require("express-session");//접속자 구분 ex) user 1 , user 2...
var passport       = require("./config/passport");
var flash          = require("connect-flash");//문자열
var bodyParser     = require("body-parser");
var app            = express();

//DB Setting
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});
//Other setting

app.use(flash());
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(session({secret:"MySecret"}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})
//Routes
app.use("/users", require("./routes/users"));
app.use("/post", require("./routes/post"));
app.use("/",require("./routes/home"));

//Port setting
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});
"/users/new"