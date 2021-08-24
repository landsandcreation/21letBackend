const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../../models/owner/owner");

//define token age to be three days day * hours * minutes * seconds 🙂
const maxAge = 3 * 24 * 60 * 60;

module.exports.signup = async (req, res) => {
  let {fName, lName, phone, email, password} = req.body;

  try {
    //check if Owner already exists 😑
    const existingOwner = await Owner.findOne({email});

    if (existingOwner) return res.status(406).json("Owner Already exists");

    //If Owner does not exist, save Owner 😉
    const result = await Owner.create({
      email,
      phone,
      password,
      name: `${fName} ${lName}`,
    });

    res.status(200).json({result});
  } catch (err) {
    res.status(500).json({error: err});
    console.log(err);
  }
};

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
      const token = jwt.sign(
        {email: OwnerExists.email, id: OwnerExists._id},
        process.env.JWT_SECRET,
        {expiresIn: maxAge}
      );

      res.cookie("jwt", token, {httpOnly: true});
      res.status(200).json({result: OwnerExists, token});
    }
  } catch (error) {
    res.status(500).json({message: error});
  }
};
