const router = require("express").Router();
const {
  getAllAvailableProperties,
  getPropertyById,
  searchProperty,
} = require("../controllers/owner/propertyInfo");

router.get("/all-properties", getAllAvailableProperties);

router.get("/get-property/:id", getPropertyById);

router.post("/search", searchProperty);
module.exports = router;
