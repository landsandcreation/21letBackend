const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    numberOfBedrooms: {
      type: Number,
      required: true,
    },
    numberOfBathrooms: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    LGA: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    specialOffer: {
      type: String,
      default: "No",
      required: true,
    },
    suitableForKids: {
      type: String,
      default: "Yes",
      required: true,
    },
    suitableForPets: {
      type: String,
      required: true,
    },
    eventsAllowed: {
      type: String,
      required: true,
    },
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otherDetails: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Property = new mongoose.model("property", propertySchema);

module.exports = Property;
