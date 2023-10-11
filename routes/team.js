const express = require("express");
const TC = require("../controller/TeamController");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/createTeam",
  [
    check("name").not().isEmpty(),
    check("description").isLength({ min: 200, max: 300 }),
    check("creator").not().isEmpty(),
  ],
  TC.createTeam
);
router.post(
  "/addMemberToTeam/:tid",
  [check("email").normalizeEmail().isEmail(),],
  TC.addMember
);
router.delete(
  "/deleteUserFromTeam/:tid/:uid",
  // [check("id").not().isEmpty(),],
  TC.deleteMember
);
router.delete(
  "/memberDeleteTeam/:tid",
  TC.deleteTeam
);
router.get("/getTeams",TC.getTeams);

module.exports = router;
