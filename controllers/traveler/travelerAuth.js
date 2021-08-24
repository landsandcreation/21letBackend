const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Traveler = require("../../models/traveler/traveler");

//define token age to be three days day * hours * minutes * seconds 🙂
const maxAge = 3 * 24 * 60 * 60;

module.exports.signup = async (req, res) => {
  let {fName, lName, phone, email, password} = req.body;

  try {
    //check if traveler already exists 😑
    const existingTraveler = await Traveler.findOne({email});

    if (existingTraveler)
      return res.status(406).json("Traveler Already exists");

    //If traveler does not exist, save traveler 😉
    const result = await Traveler.create({
      email,
      phone,
      password,
      name: `${fName} ${lName}`,
    });

    res.status(200).json({result});
  } catch (err) {
    res.status(500).json({error: err});
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
