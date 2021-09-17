var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("21Let Backend is Live");
});

module.exports = router;
