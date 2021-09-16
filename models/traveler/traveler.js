const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const travelerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: String,
      default: false,
    },
    secretToken: {
      type: String,
    },
    placeOfResidence: {
      type: String,
    },
    DOB: {
      type: String,
    },
    gender: {
      type: String,
    },
    filename: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Method to hash the password
travelerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Traveler = mongoose.model("traveler", travelerSchema);

module.exports = Traveler;
