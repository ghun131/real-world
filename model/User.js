var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  avaUrl: { type: String, unique: true, require: true },
  email: { type: String, unique: true, required: true, trim: true },
  username: { type: String, unique: true, required: true, trim: true },
  biography: { type: String, unique: true, require: true },
  loveArticles: [String],
  password: { type: String, required: true, unique: true },
  salt: { type: String },
  passwordConf: { type: String, required: true },
  followers: [String],
  following: [String],
});


var User = mongoose.model('User', UserSchema);
module.exports = User;

