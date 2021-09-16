const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  verifyAccount,
  forgotPassword,
  checkPasswordResetToken,
} = require("../controllers/owner/ownerAuth");
const {addProperty} = require("../controllers/owner/propertyInfo");
const {registerValidator, checkForErrors} = require("../validators/auth");

router.post("/sign-up", registerValidator, checkForErrors, signup);

router.post("/sign-in", signin);

router.post("/add-property", addProperty);

router.post("/verify-account", verifyAccount);

router.post("/forgot-password", forgotPassword);

router.post("/check-reset-token", checkPasswordResetToken);

module.exports = router;
