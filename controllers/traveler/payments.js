const request = require("request");
const _ = require("lodash");
const path = require("path");

const Payment = require("../../models/traveler/payments");

const {initializePayment, verifyPayment} = require("../../config/paystack")(
  request
);

module.exports.pay = (req, res) => {
  const form = _.pick(req.body, ["amount", "email", "full_name"]);

  form.metadata = {
    full_name: form.full_name,
  };

  form.amount *= 100;

  console.log(form);

  initializePayment(form, (error, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    response = JSON.parse(body);
    console.log(response);
    res.redirect(response.data.authorization_url);
  });
};

module.exports.callBack = (req, res) => {
  const ref = req.query.reference;
  console.log(ref);
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
    newPayment = {reference, amount, email, full_name};
    const payment = new Payment(newPayment);
    payment
      .save()
      .then((payment) => {
        if (!payment) {
          console.log(error);
        }
        res.redirect("/receipt/" + payment._id);
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

module.exports.receipt = (req, res) => {
  const id = req.params.id;
  Payment.findById(id)
    .then((payment) => {
      if (!payment) {
        //handle error when the payment is not found
        res.redirect("/error");
      }
      res.render("success", {payment});
    })
    .catch((e) => {
      console.log(e);
    });
};
