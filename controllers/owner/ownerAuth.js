const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const mailgun = require("mailgun-js");
const DOMAIN = process.env.EMAIL_DOMAIN;
const mg = mailgun({apiKey: process.env.EMAIL_API_KEY, domain: DOMAIN});
const Owner = require("../../models/owner/owner");

//define token age to be three days day * hours * minutes * seconds 🙂
const maxAge = 3 * 24 * 60 * 60;

// ==================== SIGN UP CONTROLLER =================
module.exports.signup = async (req, res) => {
  let {fName, lName, phone, email, password} = req.body;

  try {
    //check if Owner already exists 😑
    const existingOwner = await Owner.findOne({email});

    if (existingOwner) return res.status(406).json("Owner Already exists");

    const SecretToken = randomString.generate({
      charset: numeric,
      length: 7,
    });

    //If Owner does not exist, save Owner 😉
    const result = await Owner.create({
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
    res.status(500).json({error: err});
    console.log(err);
  }
};

// ============== VERIFY ACCOUNT CONTRROLLER ====================
module.exports.verifyAccount = async (req, res, next) => {
  try {
    const {secretToken} = req.body;

    //find account that matches the token 🤔

    const owner = await Owner.findOne({secretToken: secretToken.trim()});

    if (!owner)
      return res
        .status(406)
        .json({message: "Owner does not exist, verify token or Sign up"});

    if (owner.isVerified == true)
      return res
        .status(406)
        .json({message: "Account already verified, Please log in"});

    //if token exists 😏

    owner.isVerified = true;
    owner.secretToken = "";
    await owner.save(function (err) {
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

// ============= SIGN-IN CONTROLLER =================
module.exports.signin = async (req, res) => {
  let {email, password} = req.body;

  try {
    //check if Owner exists 😑
    const OwnerExists = await Owner.findOne({email});

    if (!OwnerExists)
      return res.status(406).json({message: "Incorrect Username or Password"});

    //check if password is correct 😒
    const isPasswordCorrect = await bcrypt.compare(
      password,
      OwnerExists.password
    );

    if (!isPasswordCorrect)
      return res.status(406).json({message: "Incorrect Username or Password"});

    if (isPasswordCorrect) {
      if (OwnerExists.isVerified === "true") {
        const token = jwt.sign(
          {email: OwnerExists.email, id: OwnerExists._id},
          process.env.JWT_SECRET,
          {expiresIn: maxAge}
        );

        res.cookie("jwt", token, {httpOnly: true});
        res.status(200).json({result: OwnerExists, token});
      } else {
        return res
          .status(401)
          .json("Your Email is not verified, Please verify");
      }
    }
  } catch (error) {
    res.status(500).json({message: "Incorrect Username or Password"});
  }
};

// ========================== FORGOT PASSWORD ========================

module.exports.forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    const owner = await Owner.findOne({email});

    if (owner) {
      var SecretToken = randomString.generate(7);
      owner.secretToken = SecretToken;

      owner.save(function (err) {
        if (err)
          return res.status(500).json({
            message: "Something Went wrong",
          });

        const data = {
          from: "noreply@21Let.com",
          to: email,
          subject: "21Let Account Password Reset",

          html: `
                <h2>Hello ${owner.name},</h2>
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
    const genuineToken = await Owner.findOne({secretToken});

    if (genuineToken) {
      console.log("correct token");
    } else {
      res.status(406).json({message: "Incorrect Token"});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deleteAllOwners = async (req, res) => {
  Owner.deleteMany({})
    .then((data) => {
      res.send("All Deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while Deleting.",
      });
    });
};
