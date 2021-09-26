const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
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
const ProfileImage = new mongoose.model("profileImage", imageSchema);

module.exports = ProfileImage;
