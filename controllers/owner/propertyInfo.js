const multer = require("multer");
const https = require("https");
const {UploadApiResponse} = require("cloudinary").v2;
const Property = require("../../models/owner/propertyInfo");

module.exports.addProperty = async (req, res) => {
  let {
    date,
    address,
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    state,
    LGA,
    phone,
    description,
    title,
    specialOffer,
    suitableForKids,
    suitableForPets,
    eventsAllowed,
    fName,
    lName,
    email,
    price,
    location,
    available,
    otherDetails,
  } = req.body;

  try {
    //create property
    const newProperty = await Property.create({
      date,
      address,
      propertyType,
      numberOfBedrooms,
      numberOfBathrooms,
      state,
      LGA,
      phone,
      description,
      title,
      specialOffer,
      suitableForKids,
      suitableForPets,
      eventsAllowed,
      fName,
      lName,
      email,
      price,
      location,
      available,
      otherDetails,
    });

    res.status(200).json({result: newProperty});
    console.log(newProperty);
  } catch (error) {
    res.status(500).json({message: error});
    console.log(error);
  }
};

module.exports.getAllAvailableProperties = async (req, res) => {
  await Property.find({available: "Yes"}, function (err, result) {
    if (err)
      return res.status(500).json({
        message: "No available properties",
      });
    res.status(200).json({
      Result: result,
    });
  });
};

module.exports.getPropertyById = async (req, res) => {
  const id = req.params.id;

  Property.findById(id)
    .then((result) => {
      if (!result)
        return res.status(404).json({message: "Property Does not Exist"});

      res.status(200).json({
        Result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.deleteProperty = async (req, res) => {
  const id = req.params;

  Property.findByIdAndRemove(id)
    .then((result) => {
      if (!result)
        return res.status(406).json({message: "Property does not exist"});

      res.status(200).json("Property deleted successfully");
    })
    .catch((err) => {
      res.status(500).json({message: err});
    });
};

module.exports.updateProperty = async (req, res) => {
  const id = req.params;

  Property.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    .then((result) => {
      if (!result)
        return res.status(406).json({message: "Property does not exist"});

      res.status(200).json("Property deleted successfully");
    })
    .catch((err) => {
      res.status(500).json({message: err});
    });
};

// ==================== SEARCH PROPERTY =======================

module.exports.searchProperty = async (req, res) => {
  // const {price, location} = req.body;
  const query = req.body.search;
  const queries = query.split(" ");
  const allQueries = [];

  queries.forEach((element) => {
    allQueries.push({location: {$regex: String(element), $options: "i"}});
  });

  const allProperties = await Property.find({
    location: req.body.search,
    $or: allQueries,
  });

  if (!allProperties || allProperties.length === 0)
    return res.status(400).json("No Properties found");
  res.status(200).json(allProperties);
};
