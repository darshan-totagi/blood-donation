<!--
  BloodConnect - README
  Enhanced by Rudrapratapsinh Chauhan for Winter of Code Social 2025
  Includes: screenshots, folder structure, contributors, and clarity improvements.
-->

# 🩸 BloodConnect

A full-stack **Blood Donation and Request Management System** built with the **MERN stack (MongoDB, Express, React, Node)**.  
This project is part of **Winter of Code Social 2025**, promoting open-source collaboration for social good.

---

<div align="center">
  <!-- Red banner -->
  <img src="https://img.shields.io/badge/MERN-BloodConnect-%23d62828?style=for-the-badge&logo=appveyor" alt="BloodConnect Banner" />

  <br>

  <!-- Tech badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind-CB3837?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  </p>

  <p><strong>A community-driven platform to connect blood donors and recipients — saving lives through open source.</strong></p>
</div>

---

## 🖼️ Project Preview

<div align="center">
  <img src="client/public/preview.png" alt="BloodConnect Preview" width="800" />
  <p><em>Sample dashboard view (replace with actual screenshot)</em></p>
</div>

---

## 🌍 About the Project

**BloodConnect** aims to make blood donation more accessible, transparent, and efficient.  
It connects **donors** and **recipients** in real time, bridging the gap between blood demand and availability.

Initiated under **Winter of Code Social 2025**, this project promotes **social impact through technology** — solving one of healthcare’s most critical needs: timely access to blood donors.

---

## 🧩 Core Features

- 🩸 Register as a **donor** — share your blood group, contact, and city  
- 🔍 Search for **donors** by **name, phone number, city, or blood group**  
- 🧾 **Request blood** directly from available donors  
- 🤝 **Verified profiles** for secure connections  
- 📱 Fully **responsive UI** (React + Tailwind CSS)  
- ⚙️ **Node + Express + MongoDB** backend for reliable data handling  

---

## 🧱 System Architecture

```text
Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
Database (MongoDB via Mongoose)

🗂 Folder Structure
BloodConnect/
├── client/             # React frontend (Vite + Tailwind)
│   ├── public/         # Static assets and images
│   ├── src/            # React components, pages, and styles
│   └── ...
│
├── server/             # Express backend
│   ├── controllers/    # Logic for routes
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── ...
│
├── .env.example        # Sample environment variables
├── README.md           # Project documentation
├── LICENSE             # License information
└── package.json

🧰 Tech Stack
Frontend ⚛️

React (Vite)

Tailwind CSS

Backend 🧩

Node.js & Express.js

MongoDB (Mongoose)

REST APIs for donor and request management

🚀 Quick Start
Prerequisites 🧾

Node.js (v20+)

MongoDB (local or Atlas)

Git

Clone the Repository ⤵️
git clone https://github.com/darshan-totagi/blood-donation.git
cd blood-donation

Install Dependencies

Server

cd server
npm install


Client

cd ../client
npm install

Environment Variables 🌿

There is an .env.example in server/.

Example:

PORT=5000
MONGO_URI=<your_mongodb_connection_string>


Rename .env.example → .env and update your credentials.

Run the App 🧑‍💻

Use two terminals:

# Terminal 1 (Server)
cd server
npm start

# Terminal 2 (Client)
cd client
npm run dev


Frontend → http://localhost:5173

Backend → http://localhost:5000

🧠 Future Enhancements

📍 Google Maps integration for nearby donors

🩺 Donation history tracking

💬 Real-time chat between donors and recipients

🧾 Role-based access for hospitals and admins

📬 Email/SMS alerts for urgent requests

🤝 Contributing

We welcome contributions from everyone!

Steps:

🍴 Fork this repository

🌿 Create your branch → feature/your-feature-name

🧪 Make and test your changes locally

💌 Commit & push

🔁 Open a Pull Request describing your changes and issue reference

Example commit:

git commit -m "🧾 Enhanced README with folder structure and screenshots"

👥 Contributors

Thanks to all amazing contributors under Winter of Code Social 2025 💪

<a href="https://github.com/darshan-totagi/blood-donation/graphs/contributors"> <img src="https://contrib.rocks/image?repo=darshan-totagi/blood-donation" /> </a>
📄 License
<div align="center"> <strong>MIT License</strong> <p>This project is licensed under the MIT License. See the <code>LICENSE</code> file for details.</p> </div>
💬 Support & Community

If you find this project helpful, please ⭐ star the repository to show your support.

For questions or collaboration:

🧑‍💻 Open a GitHub issue

💬 Join Discussions

📩 Tag your mentor or maintainers in the issue


