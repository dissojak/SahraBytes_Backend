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
    joined_team: "-1",
    banned: false,
    isAdmin: false,
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
  const { newPw, oldPw } = req.body;
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  if (user.pw !== oldPw) {
    return next(
      new HttpError(
        " the old password is not matching with provided one check the old password again ! ",
        500
      )
    );
  }
  user.pw = newPw;

  try {
    await user.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.changeUsername = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { username } = req.body;
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  user.username = username.toLowerCase();

  try {
    await user.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.changeEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { email } = req.body;
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  user.email = email;

  try {
    await user.save();
  } catch (e) {
    return next(new HttpError(" Updating place failed ! ", 500));
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.getUsersByTeamId = async (req, res, next) => {
  const TeamId = req.params.tid;
  let USERS;
  try {
    USERS = await User.find({ joined_team: TeamId }, "username role");
  } catch (err) {
    return next(new HttpError(" Somthing Went Wrong HERE ! ", 500));
  }
  if (!USERS || USERS.length === 0) {
    next(new HttpError("couldn't find User for the provided Team id", 404));
  } else {
    res.json({
      USERS: USERS.map((user) => user.toObject({ getters: true })),
    });
  }
};



//admin function
exports.updateAllUsersToAdmin = async (req, res, next) => {
  try {
    await User.updateMany({}, { isAdmin: false });
    res.json( 'all users updated to admin.' );
  } catch (error) {
    return next(new HttpError('Error updating users to admin', 500));
  }
};

