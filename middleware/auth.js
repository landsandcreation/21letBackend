const jwt = require("jsonwebtoken");
const Owner = require("../models/owner/owner");

//Require a user to log in before being able to acces a route 😚

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check if token exists and is verified

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // req.flash("error", "Please Log in first");
        // res.redirect("/users/login");
      }
      next();
    });
  } else {
    // req.flash("error", "Log in first");
    // res.redirect("/users/login");
  }
};

//get logged in user's details 😑

const checkUser = (req, res, next) => {
  const token = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await Owner.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {requireAuth, checkUser};
