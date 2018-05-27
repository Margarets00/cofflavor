var express  = require("express");
var router   = express.Router();
var User     = require("../models/User");

//New
router.get("/new", function(req, res){
    res.render("users/new");
  });

  module.exports = router;