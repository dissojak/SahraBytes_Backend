const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Hackaton = require("../models/hackaton");
const Team = require("../models/team");
const User = require("../models/user");

exports.getHackatonById = async (req, res, next) => {
  const hackatonId = req.params.hid;
  let hackaton;
  try {
    hackaton = await Hackaton.findById(hackatonId);
  } catch (e) {
    return next(new HttpError(" Somthing Went Wrong ! ", 500));
  }
  if (!hackaton) {
    return next(
      new HttpError("couldn't find hackaton for the provided id", 404)
    );
  }
  res.json({ hackaton: hackaton.toObject({ getters: true }) });
};

exports.getHackatons = async (req, res, next) => {
  const hackatons = await Hackaton.find({}, "-documents -description");
  // still need to use * members.length * to give the length of members
  res.status(200).json({
    teams: hackatons.map((hackaton) => hackaton.toObject({ getters: true })),
  });
};

exports.addParticipant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid Inputs , check your data ", 422));
  }
  const { userId, hackatonId } = req.body;
  let hackaton;
  try {
    hackaton = await Hackaton.findById(hackatonId);
  } catch (e) {
    return next(new HttpError(" adding hackaton fail ! ", 500));
  }
  if (!hackaton) {
    return next(new HttpError(" we could not find this hackaton ! ", 404));
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    return next(new HttpError(" adding hackaton fail  ! ", 500));
  }
  if (!user) {
    return next(new HttpError(" we could not find this user ! ", 404));
  }
  const teamId = user.joined_team;
  let team;
  try {
    team = await Team.findById(teamId);
  } catch (e) {
    return next(new HttpError(" adding hackaton fail  ! ", 500));
  }
  if (!team) {
    return next(new HttpError(" we could not find this team ! ", 404));
  }

  try {
    const SESSION = await mongoose.startSession();
    SESSION.startTransaction();
    team.joined_hackathon.push(hackaton);
    await team.save({ SESSION });
    hackaton.participants.push(team);
    //   = team._id.toString();
    await hackaton.save({ SESSION });
    await SESSION.commitTransaction();
  } catch (e) {
    console.error(e);
    return next(new HttpError(" adding the member to team failed !!! ", 500));
  }
  res.status(201).json({ hackaton: hackaton.toObject({ getters: true }) });
  // whatever !! 
};
