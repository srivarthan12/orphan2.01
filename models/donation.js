const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  items: {
    type: [
      {
        name:{type:String},
        _id: {
          type: mongoose.Schema.Types.ObjectId, // Assuming item IDs are MongoDB ObjectIDs
          ref: 'Item', // Reference to the items collection
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  }
});

module.exports = mongoose.model('Donation', DonationSchema);