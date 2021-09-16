const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified:{
      type: String,
      default: false
    },
    secretToken:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

//Method to hash the password
ownerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Owner = mongoose.model("owner", ownerSchema);

module.exports = Owner;
