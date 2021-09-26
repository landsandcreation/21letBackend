const mongoose = require("mongoose");

const propertyImageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const PropertyImage = new mongoose.model("propertyImage", propertyImageSchema);

module.exports = PropertyImage;
