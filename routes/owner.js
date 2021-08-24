const express = require("express");
const router = express.Router();
const {signup, signin} = require("../controllers/owner/ownerAuth");
const {addProperty} = require("../controllers/owner/propertyInfo");
const {registerValidator, checkForErrors} = require("../validators/auth");

router.post("/sign-up", registerValidator, checkForErrors, signup);

router.post("/sign-in", signin);

router.post("/add-property", addProperty);

module.exports = router;
