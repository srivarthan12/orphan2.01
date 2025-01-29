const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Essential = require("../models/essentials");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Fetch all essentials
router.get("/", async (req, res) => {
  try {
    const essentials = await Essential.find();
    res.json(essentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/createe', async (req, res) => {
  const essential = new Essential(req.body);
  try {
    const newEssential = await essential.save();
    res.status(201).json(newEssential);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//delete
router.delete("/delete/:id", async (req, res) => {
  try {
      const { id } = req.params;
      console.log("Received DELETE request for ID:", id);

      // Find the essential by ID and delete it
      const essential = await Essential.findByIdAndDelete(id);

      if (!essential) {
          return res.status(404).json({ message: "Essential not found" });
      }

      res.json({ message: "Essential deleted successfully" });
  } catch (error) {
      console.error("Error deleting essential:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// Add new essential
router.post("/checkout", async (req, res) => {
  const { items, email } = req.body;

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item.description || "No description available",
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
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

// Update quantities after donation
router.put("/", async (req, res) => {
  const { items } = req.body;

  try {
    for (const item of items) {
      const essential = await Essential.findById(item._id);
      if (essential) {
        essential.quantityAvailable -= item.quantityDonated;
        if (essential.quantityAvailable <= 0) {
          essential.quantityAvailable = 0;
        }
        await essential.save();
      }
    }
    res.status(200).json({ message: "Quantities updated successfully." });
  } catch (error) {
    console.error("Error updating quantities:", error);
    res.status(500).json({ message: "Failed to update quantities." });
  }
});


module.exports = router;
