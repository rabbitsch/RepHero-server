const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  firstname: { type: String },
  lastname: { type: String }
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    password: this.password,
    firstname: this.firstname,
    lastname: this.lastname
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
