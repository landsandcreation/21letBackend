const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  verifyAccount,
  forgotPassword,
  checkPasswordResetToken,
  deleteAllOwners,
} = require("../controllers/owner/ownerAuth");
const {addProperty} = require("../controllers/owner/propertyInfo");
const {registerValidator, checkForErrors} = require("../validators/auth");
const {checkUser} = require('../middleware/auth')

router.post("/sign-up", registerValidator, checkForErrors, signup);

router.post("/sign-in", checkUser,signin);

router.post("/add-property", addProperty);

router.post("/verify-account", verifyAccount);

router.post("/forgot-password", forgotPassword);

router.post("/check-reset-token", checkPasswordResetToken);

router.get("/deleteAllOwners", deleteAllOwners);
module.exports = router;
