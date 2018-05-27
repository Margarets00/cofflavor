var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// shcema
var userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"유저네임을 반드시 입력하세요!"],
        match:[/^.{4,12}&/,"4-12글자 이상으로 입력하세요!"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        requred:[true,"비밀번호를 반드시 입력하세요!"],
        select:false
    },
    name:{
        type:String,
        required:[true,"이름을 반드시 입력하세요!"],
        match:[/^.{3,12}$/,"3-12글자 이상으로 입력하세요!"],
        trim:true
    },
    email:{
        type:String,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일형식에 맞게 써주세요!"],
        trim:true
    }
},{
    toObject:{virtuals:true}
});

//virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){return this._passwordConfirmation;})
.set(function(value){this._passwordConfirmation=value;});

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;