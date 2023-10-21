const stripe = require("stripe")(
  "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"
);
const express = require("express");
let router = express.Router();

module.exports = router;

router.post("/create-checkout-session", async (req, res) => {
  console.log(req.body.customer_id, "req sent");
  try{
  const session = await stripe.checkout.sessions.create({
    success_url: `https://app.sparktechdesign.com/success-b1ded2d5-8ecc-4e71-a2d5-a4eccb5f49857c514309-f80d-4e7e-8dba-898caa2b1095`,
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1NhWwfSG6QvARlMBxvnwH9ey",
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: req.body.customer_id,
    cancel_url: `https://app.sparktechdesign.com`,
  }).then((r)=>{
    console.log(r)
    console.log("In then")
  }).catch((err)=>{
    console.log("In catch", err)
  });
  console.log(session, "Session of the user");
  res.redirect(303, session.url);
}
catch(error){
  console.log("Request Failed")
}
});
