var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

  name: String,
  username: {type: String, required: true, index: {unique: true}},

  //Select:false is used when we do not want to query for password when searching a user.
  password: {type: String, required: true, selec:; false}
});

UserSchema.pre('save',function(next){

  if(!user.isModified('password'))
  return next():

  bcrypt.hash(user.password,null,null,function(err,hash){

    if(err)
    return next(err);

    user.password = hash;
    next();
  });
});

//Custom Method to check whether typed password and password saved in db is same or not.

UserSchema.methods.comparePassword = function(password){

  var user = this;

  //compareSync compares two passwords.
  return bcrypt.compareSync(password,user.password);
};

module.exports = mongoose.model('User',UserSchema);
