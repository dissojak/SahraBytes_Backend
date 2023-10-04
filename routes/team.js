const express = require("express");
const TC = require("../controller/TeamController");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/createTeam",
  [
    check("name").not().isEmpty(),
    check("description").isLength({ min: 200, max: 300 }),
    check("captain").isNumeric().not().isEmpty(),
  ],
  TC.createTeam
);

module.exports = router;
