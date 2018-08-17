var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
    username:{
      type:String,
      required:[true,"아이디를 입력하세요!"],
      match:[/^.{4,12}$/,"4-12글자여야 합니다!"],//정규표현식[참,거짓] 거짓이면 뒤 문자를 반환한다
      trim:true,//빈칸을 제거해줄지 묻는 속성 
      unique:true//중복되지 않아야 함
    },
    password:{
      type:String,
      required:[true,"비밀번호를 입력하세요!"],
      select:false
    },
    name:{
      type:String,
      required:[true,"닉네임을 입력하세요!"],
      match:[/^.{4,12}$/,"Should be 4-12 characters!"],
      trim:true
    },                              
    email:{
      type:String,
      match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일 주소가 유효하지 않습니다!"],
      trim:true
    }
  },{
    toObject:{virtuals:true}
});

// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/; // 2-1
var passwordRegexErrorMessage = "8자리 이상의 알파벳과 숫자 혼합으로 만들어 주세요."; // 2-2

userSchema.path("password").validate(function(v) {
  var user = this;

  // create user 신규 유저일땐 비번이랑 비번확인만 체크
  if(user.isNew){
    if(!user.passwordConfirmation){ 
      user.invalidate("passwordConfirmation", "비밀번호 확인을 입력 해 주세요.");
    }
    if(!passwordRegex.test(user.password)){ // 2-3
      user.invalidate("password", passwordRegexErrorMessage); // 2-4
    }
    else if(user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다!");
    }
  }
});

// hash password 비번 암호화
userSchema.pre("save", function (next){
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;
