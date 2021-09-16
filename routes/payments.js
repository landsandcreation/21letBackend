const router = require("express").Router();
const request = require("request");
const _ = require("lodash");
const path = require("path");
const {pay, callBack, receipt} = require("../controllers/traveler/payments");
const Payment = require("../models/traveler/payments");

const {initializePayment, verifyPayment} =
  require("../config/paystack")(request);

router.get("/pay", (req, res) => {
  res.render("pay");
});
router.post("/pay", pay);

router.get("/callback", (req, res) => {
  const ref = req.query.reference;

  verifyPayment(ref, (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error);
      // return res.redirect("/error");
    }
    response = JSON.parse(body);
    const data = _.at(response.data, [
      "reference",
      "amount",
      "customer.email",
      "metadata.full_name",
    ]);

    [reference, amount, email, full_name] = data;

    FormattedAmount = data[1] / 100;

    newPayment = {reference, amount: FormattedAmount, email, full_name};
    const payment = new Payment(newPayment);
    payment
      .save()
      .then((payment) => {
        if (!payment) {
          console.log(error);
        }
        res.redirect("/paystack/receipt/" + payment._id);
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

router.get("/receipt/:id", receipt);

module.exports = router;
