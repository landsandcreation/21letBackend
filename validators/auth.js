const {body, validationResult} = require("express-validator");

//validation rules for registering

const registerValidator = [
  body("email")
    .isLength({min: 1})
    .withMessage("Please Enter Your Email")
    .isEmail()
    .withMessage("Please Enter a Valid Email"),
  body("phone")
    .isLength({min: 11, max: 11})
    .withMessage("Please Enter Your Phone Number"),
  body("fName").isLength({min: 1}).withMessage("Please Enter Your First Name"),
  body("lName").isLength({min: 1}).withMessage("Please Enter Your Last Name"),
  body("password").isLength({min: 1}).withMessage("Please Enter a Password"),
];

//get just the error messages, no extra crap
const errMsgAlone = validationResult.withDefaults({
  formatter: (err) => err.msg,
});

const checkForErrors = (req, res, next) => {
  const errors = errMsgAlone(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }
  next();
};

module.exports = {checkForErrors, registerValidator};
