const express = require("express");
const UC = require("../controller/UserController");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("username").not().isEmpty(),
    check("age").isNumeric().isLength({ min: 2, max: 2 }),
    check("pw").isLength({ min: 3 }),
  ],
  UC.signupUser
);
router.post("/login", UC.loginUser);
router.post(
  "/settings/password/:uid",
  [check("newPw").isLength({ min: 3 }),check("oldPw").isLength({ min:3})],
  UC.changePassword
);
router.post(
  "/settings/username/:uid",
  [check("username").not().isEmpty()],
  UC.changeUsername
);
router.post(
  "/settings/email/:uid",
  [check("email").normalizeEmail().isEmail()],
  UC.changeEmail
);
router.get("/getUsersByTeamId/:tid",UC.getUsersByTeamId);

module.exports = router;
