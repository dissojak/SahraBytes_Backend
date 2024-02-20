const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  age: { type: Number },
  pw: { type: String, required: true, minlength: 3 },
  role: { type: String, required: true },
  profileImage: { type: String },
  joined_team: { type: String, required: true },
  banned: { type: Boolean, required: true },
  isAdmin: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
