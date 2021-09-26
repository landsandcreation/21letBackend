const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const multer = require("multer");
const https = require("https");
const {UploadApiResponse} = require("cloudinary").v2;
const mailgun = require("mailgun-js");
const DOMAIN = process.env.EMAIL_DOMAIN;
const mg = mailgun({apiKey: process.env.EMAIL_API_KEY, domain: DOMAIN});
const Traveler = require("../../models/traveler/traveler");

//define token age to be three days day * hours * minutes * seconds 🙂
const maxAge = 3 * 24 * 60 * 60;

//image upload sturvs 😁

const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

module.exports.signup = async (req, res) => {
  let {fName, lName, phone, email, password} = req.body;

  try {
    //check if traveler already exists 😑
    const existingTraveler = await Traveler.findOne({email});

    if (existingTraveler)
      return res.status(406).json("Traveler Already exists");

    const SecretToken = randomString.generate({
      charset: "numeric",
      length: 7,
    });
    //If traveler does not exist, save traveler 😉
    const result = await Traveler.create({
      email,
      phone,
      password,
      secretToken: SecretToken,
      name: `${fName} ${lName}`,
    });

    const data = {
      from: "noreply@21Let.com",
      to: email,
      subject: "21Let Account Activation",

      html: `
            <h2>Hello ${result.name},</h2>
            <h4>Please verify your email address by pasting the token below in the 21Let verify-email-address-page</h4><br>
            <p><b><h3> ${result.secretToken}</h3> </b></p>
        `,
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        console.log(error);
      }
      console.log({
        message: "Email has been sent, Kindly activate your account",
      });
    });

    res.status(200).json({result});
  } catch (err) {
    console.log(err);
    res.status(500).json({err});
  }
};

// ============== VERIFY ACCOUNT CONTRROLLER ====================
module.exports.verifyAccount = async (req, res, next) => {
  try {
    const {secretToken} = req.body;

    //find account that matches the token 🤔

    const traveler = await Traveler.findOne({secretToken: secretToken.trim()});

    if (!traveler)
      return res
        .status(406)
        .json({message: "Traveller does not exist, verify token or Sign up"});

    if (traveler.isVerified == true)
      return res
        .status(406)
        .json({message: "Account already verified, Please log in"});

    //if token exists 😏

    traveler.isVerified = true;
    traveler.secretToken = "";
    await traveler.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res
        .status(200)
        .json({message: "Your Account was Verified Successfully"});
    });
  } catch (error) {
    next(error);
  }
};

module.exports.signin = async (req, res) => {
  let {email, password} = req.body;

  try {
    //check if traveler exists 😑
    const travelerExists = await Traveler.findOne({email});

    if (!travelerExists)
      return res.status(406).json({message: "Incorrect Username or Password"});

    //check if password is correct 😒
    const isPasswordCorrect = await bcrypt.compare(
      password,
      travelerExists.password
    );

    if (!isPasswordCorrect)
      return res.status(406).json({message: "Incorrect Username or Password"});

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {email: travelerExists.email, id: travelerExists._id},
        process.env.JWT_SECRET,
        {expiresIn: maxAge}
      );

      res.cookie("jwt", token, {httpOnly: true});
      res.status(200).json({result: travelerExists, token});
    }
  } catch (error) {
    res.status(500).json({message: error});
  }
};

// ========================== FORGOT PASSWORD ========================

module.exports.forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    const traveler = await Traveler.findOne({email});

    if (owner) {
      var SecretToken = randomString.generate(7);
      traveler.secretToken = SecretToken;

      traveler.save(function (err) {
        if (err)
          return res.status(500).json({
            message: "Something Went wrong",
          });

        const data = {
          from: "noreply@21Let.com",
          to: email,
          subject: "21Let Account Password Reset",

          html: `
                <h2>Hello ${traveler.name},</h2>
                <h4>Please reset your password by pasting the token below in the 21Let Password Reset Page</h4><br>
                <p><b><h3> ${SecretToken}</h3> </b></p>
            `,
        };
        mg.messages().send(data, function (error, body) {
          if (error) {
            console.log(error);
          }
          console.log({
            message: "Email has been sent, Kindly reset your Password",
          });
        });
        res.status(200).json({message: "Token sent"});
      });
    } else {
      res.status(406).json({
        message: "Incorrect Email",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.checkPasswordResetToken = async (req, res) => {
  const {secretToken, email, password} = req.body;

  try {
    const genuineToken = await Traveler.findOne({secretToken});

    if (genuineToken) {
      console.log("correct token");
    } else {
      res.status(406).json({message: "Incorrect Token"});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.profile = async (req, res) => {
  if (!req.body) {
    res.status(400).json({message: "No data was provided"});
  }

  let {placeOfResidence, DOB, gender} = req.body;

  const id = req.params.id;

  Traveler.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    .then((data) => {
      if (!data) {
        res.status(400).json({message: `Profile with id ${id} was not found`});
      } else res.status(200).json({data});
    })
    .catch((err) => {
      res.status(500).json({message: "Error updating Profile"});
    });
};

module.exports.getAllTravelers = async (req, res) => {
  await Traveler.find({}, function (err, result) {
    if (err)
      return res.status(500).json({
        message: "No available properties",
      });
    res.status(200).json({
      Result: result,
    });
  });
};

module.exports.deleteAllTravellers = async (req, res) => {
  Traveler.deleteMany({})
    .then((data) => {
      res.send("All Deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while Deleting.",
      });
    });
};
