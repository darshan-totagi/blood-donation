// Run with: node seed.js after installing dependencies and setting MONGO_URI in .env
const mongoose = require('mongoose');
const Donor = require('./models/Donor');
require('dotenv').config();
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/blood-donor';
import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI =>", process.env.MONGO_URI);


mongoose.connect(MONGO).then(async ()=> {
  await Donor.deleteMany({});
  await Donor.insertMany([
    { name: 'Asha Patel', phone: '+919876543210', bloodGroup: 'A+', city: 'Ahmedabad', notes: 'Donated 3 times', availability: 'Available' },
    { name: 'Rohit Verma', phone: '+919812345678', bloodGroup: 'O+', city: 'Mumbai', availability: 'On-call' },
    { name: 'Sana Khan', phone: '+919998887776', bloodGroup: 'B-', city: 'Delhi', notes: 'Prefers government hospitals', availability: 'Available' }
  ]);
  console.log('seeded');
  process.exit(0);
}).catch(err => console.error(err));
