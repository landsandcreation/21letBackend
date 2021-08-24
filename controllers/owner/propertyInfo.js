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
      otherDetails,
    });

    res.status(200).json({result: newProperty});
    console.log(newProperty);
  } catch (error) {
    res.status(500).json({message: error});
    console.log(error);
  }
};
