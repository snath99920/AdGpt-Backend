const stripe = require("stripe")(
  "sk_test_51NZ7FrSDiry9BakpqzRoP2OqBxB1WfRcFKriJklgte64CMulin32S0hMR3GWxHuxHrXycgMZWmqeRBrNXGTPaEkT00eIRMA0oh"
);
const express = require("express");
let router = express.Router();

module.exports = router;

router.post("/create-checkout-session", async (req, res) => {
  console.log("req sent");
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1NZV5sSDiry9BakpEH5rSz01",
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `http://localhost:5177/success-b1ded2d5-8ecc-4e71-a2d5-a4eccb5f49857c514309-f80d-4e7e-8dba-898caa2b1095`,
    cancel_url: `http://localhost:5177`,
  });
  console.log(session);

  res.redirect(303, session.url);
});
