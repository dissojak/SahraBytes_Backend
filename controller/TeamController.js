const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Team = require("../models/team");
const User = require("../models/user");

exports.createTeam = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError("Invalid Inputs , check your data ", 422));
    }

    let user;
    try {
        user = await User.findById(creator);
      } catch (e) {
        return next(new HttpError(" Creating place failed ! ", 500));
      }
    
      if (!user) {
        return next(
          new HttpError(" we could not find user for provided id ! ", 404)
        );
      }
  
    const { name, description, creator } = req.body;
    const createdTeam = new Team({
      name,
      description,
      captain:creator,
      members:[creator,],
      joined_hackathon:[],
    });
  
    try {
      const SESSION = await mongoose.startSession();
      SESSION.startTransaction();
      await createdTeam.save({ SESSION });
      user.joined_team.push(creator);
      await user.save({ SESSION });
      await SESSION.commitTransaction();
    } catch (e) {
      return next(new HttpError(" Creating place failed ! ", 500));
    }
    res.status(201).json({ team: createdTeam });
  };