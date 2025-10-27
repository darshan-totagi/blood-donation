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

app.post('/api/donors', async (req, res) => {
  try {
    const data = req.body;
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
