//index.js

var methodOverride = require("method-override");
var express        = require("express");
var app            = express();
var mongoose       = require("mongoose");
var session        = require("express-session");
var passport       = require("./config/passport");
var flash          = require("connect-flash");
var bodyParser     = require("body-parser");
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
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
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
app.use("/",require("./routes/home"));
app.use("/users", require("./routes/users"));

//Port setting
app.listen(3000, function(){ 
    console.log('Server On!');
});