const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const Donor = require('./models/Donor');

// Basic health
app.get('/', (req, res) => res.send({status: 'ok'}));

/**
 * GET /api/donors
 * optional query:
 *  q - name or phone partial
 *  bloodGroup - exact blood group
 *  city - partial city
 */
app.get('/api/donors', async (req, res) => {
  try {
    const { q, bloodGroup, city } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { phone: new RegExp(q, 'i') }];
    if (city) filter.city = new RegExp(city, 'i');

    const donors = await Donor.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ error: 'not found' });
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

app.post('/api/donors', async (req, res) => {
  try {
    const data = req.body;
    data.name = String(data.name || '').trim();
    data.city = String(data.city || '').trim();
    data.phone = String(data.phone || '').replace(/\D/g, '');
    if (!data.name || data.name.length < 2) return res.status(400).json({ error: 'invalid name' });
    if (!data.city) return res.status(400).json({ error: 'invalid city' });
    if (!data.phone || data.phone.length < 10 || data.phone.length > 15) return res.status(400).json({ error: 'invalid phone' });

    const exists = await Donor.findOne({ phone: data.phone });
    if (exists) return res.status(409).json({ error: 'duplicate phone' });

    const donor = new Donor(data);
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donor) return res.status(404).json({ error: 'not found' });
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/donors/:id/donations', async (req, res) => {
  try {
    const { date, location, notes } = req.body;
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ error: 'not found' });
    const donationDate = date ? new Date(date) : new Date();
    if (isNaN(donationDate.getTime())) return res.status(400).json({ error: 'invalid date' });
    donor.donationHistory.push({ date: donationDate, location, notes });
    donor.lastDonatedAt = donationDate;
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/blood-donor';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to mongo');
    app.listen(PORT, () => console.log('server running on port', PORT));
  })
  .catch(err => {
    console.error('mongo connection error', err);
  });
