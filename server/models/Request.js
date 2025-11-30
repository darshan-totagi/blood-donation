// d:\blood-donation\server\models\Request.js
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  city: { type: String, required: true },
  hospital: { type: String },
  units: { type: Number, default: 1, min: 1 },
  contactPhone: { type: String, required: true },
  neededBy: { type: Date, required: true },
  notes: { type: String },
  status: { type: String, enum: ['open', 'fulfilled'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);