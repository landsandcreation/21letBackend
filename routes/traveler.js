const express = require("express");

const router = express.Router();

const multer = require("multer");
const https = require("https");
const {UploadApiResponse} = require("cloudinary").v2;
const cloudinary = require("cloudinary").v2;
const Traveler = require("../models/traveler/traveler");

const profileImage = require("../models/images/profileImages");

const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

const {
  signup,
  signin,
  profile,
  deleteAllTravellers,
  getAllTravelers,
} = require("../controllers/traveler/traveler");
const {registerValidator, checkForErrors} = require("../validators/auth");
const {checkUser} =  require('../middleware/auth')

router.post("/sign-up", registerValidator, checkForErrors, signup);

router.post("/sign-in", checkUser,signin);
router.get("/deleteAllTravellers", deleteAllTravellers);

router.post("/profile/:id", profile);
router.post("/profileImage/:id", upload.single("myImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(406).json({message: "Ment?"});

    let uploadedImage = UploadApiResponse;

    try {
      uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "ProfileImages",
        resource_type: "auto",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }

    const {originalname} = req.file;
    const {secure_url} = uploadedImage;

    const image = await profileImage
      .create(
        {
          filename: originalname,
          secure_url,
        },
        {
          useFindAndModify: false,
        }
      )
      .then((data) => {
        if (!data) {
          return res.status(400).json(err);
        } else {
          res.status(200).json(data);
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(501).json(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/allGuests", getAllTravelers);
module.exports = router;
