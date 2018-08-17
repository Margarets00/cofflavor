var mongoose = require("mongoose");

var postSchema = mongoose.Schema({ // 1 글 작성 스키마 만들어주기
    title:{type:String, required:true},
    category:{type:String},
    tag:{type:String},
    url:{type:String},
    body:{type:String},
    comments:{type:Array},
    star:{type:Number, default:5},
    starcnt:{type:Number, default:1},
    createdAt:{type:Date, default:Date.now},
},{
    toObject:{virtuals:true} 
});

postSchema.virtual("createdDate")
.get(function(){
 return getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
 return getTime(this.createdAt);
});


// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;


// functions
function getDate(dateObj){
 if(dateObj instanceof Date)
  return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj){
 if(dateObj instanceof Date)
  return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num){
 return ("0" + num).slice(-2);
}