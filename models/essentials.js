const mongoose = require('mongoose');

const EssentialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantityAvailable: { type: Number, required: true },
});

module.exports = mongoose.model('Essential', EssentialSchema);