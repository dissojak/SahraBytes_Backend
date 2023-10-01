const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { email, username, pw, age, role } = req.body;
  const createdUser = new User({
    email,
    username: username.toLowerCase(),
    pw,
    age,
    role: role || "member",
    joined_team: -1,
    banned: false,
  });
  try {
    await createdUser.save();
    console.log("User saved successfully");
  } catch (e) {
    return next(new HttpError(" Creating User failed ! ", 500));
  }
  res.status(201).json({
    message: "User has been added succsessfully !",
    user: createdUser.toObject({ getters: true }),
  });
};

exports.loginUser = async (req, res, next) => {
  const { email, pw } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  if (!user) {
    return next(new HttpError("Invalid Account !", 401));
  }
  if (user.pw !== pw) {
    return next(new HttpError("Incorrect Password !", 401));
  }
  if (user.banned === true) {
    res.json({ message: ` User ${user.username} is Banned ! `, banned: true });
  } else {
    res.json({ message: ` welcome Mr/Ms ${user.username} ` });
  }
};

exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { pw , } = req.body;
  const userId = req.params.uid;
  let newUser;
  try {
    newUser = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  // if (newUser.pw!==oldPw) {
  //   return next(new HttpError(" the old password is wrong ! ", 500));
  // }
  newUser.pw = pw;

  try {
    await newUser.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ newUser: newUser.toObject({ getters: true }) });
};

exports.changeUsername = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { username } = req.body;
  const userId = req.params.uid;
  let newUser;
  try {
    newUser = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  newUser.username = username.toLowerCase();

  try {
    await newUser.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ newUser: newUser.toObject({ getters: true }) });
};

exports.changeEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { email } = req.body;
  const userId = req.params.uid;
  let newUser;
  try {
    newUser = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  newUser.email = email;

  try {
    await newUser.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ newUser: newUser.toObject({ getters: true }) });
};

