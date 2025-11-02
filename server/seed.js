// Run with: node seed.js after installing dependencies and setting MONGO_URI in .env
import mongoose from 'mongoose';
import Donor from './models/Donor.js';
import dotenv from 'dotenv';
dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/blood-donor';
console.log("MONGO_URI =>", process.env.MONGO_URI);


mongoose.connect(MONGO).then(async ()=> {
  await Donor.deleteMany({});
  await Donor.insertMany([
    { name: 'Asha Patel', phone: '+919876543210', bloodGroup: 'A+', city: 'Ahmedabad', notes: 'Donated 3 times', availability: 'Available', allowCall: true },
    { name: 'Rohit Verma', phone: '+919812345678', bloodGroup: 'O+', city: 'Mumbai', availability: 'On-call', allowCall: false },
    { name: 'Sana Khan', phone: '+919998887776', bloodGroup: 'B-', city: 'Delhi', notes: 'Prefers government hospitals', availability: 'Available', allowCall: true }
  ]);
  console.log('seeded');
  process.exit(0);
}).catch(err => console.error(err));
