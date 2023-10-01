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
  "/settings/pw/:uid",
  [check("pw").isLength({ min: 3 })],
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

module.exports = router;
