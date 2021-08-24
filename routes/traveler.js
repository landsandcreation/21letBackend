const express = require("express");
const router = express.Router();
const {signup, signin} = require("../controllers/traveler/travelerAuth");
const {registerValidator, checkForErrors} = require("../validators/auth");

router.post("/sign-up", registerValidator, checkForErrors, signup);

router.post("/sign-in", signin);
module.exports = router;
