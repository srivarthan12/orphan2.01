const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Donation = require("../models/donation");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.get("/get", async (req, res) => {
  try {
    const Donations = await Donation.find();
    res.json(Donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Free donation (direct save)
router.post("/free", async (req, res) => {
  const donation = new Donation(req.body);
  try {
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.post('/essential', async (req, res) => {
  const donation = new Donation(req.body);

  try {
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Create a Stripe Checkout Session for free donations
router.post("/free/checkout", async (req, res) => {
  const { amount, donorName, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Free Donation",
              description: `Donation from ${donorName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});




module.exports = router;
