const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  notes: { type: String },
  availability: { type: String, default: 'Available' },
  allowCall: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Donor', DonorSchema);
