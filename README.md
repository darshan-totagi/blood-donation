
<!--
  BloodConnect - README
  Enhanced for Winter of Code Social 2025: banner, badges, setup clarity, contributor focus.
-->

# 🩸 BloodConnect

A full-stack Blood Donation and Request Management System built with the MERN stack (MongoDB, Express, React, Node).  
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

## 🌍 About the Project

**BloodConnect** bridges the gap between **blood donors** and **recipients**, making blood donation more accessible, transparent, and efficient.

It allows users to:
- Register as a donor,
- Search for blood by group or city,
- Request help directly from available donors, and
- Connect safely through verified profiles.

Initiated as part of **Winter of Code Social 2025**, this project demonstrates how open-source collaboration can create **real social impact** using technology.

---

## 🔧 Core Features

- 🩸 **Register as a donor** — share your blood group, contact, and city  
- 🔍 **Search for donors** by **name, phone number, city, or blood group**  
- 🧾 **Request blood** and reach out directly to available donors  
- 🤝 **Connect safely and securely** using verified profiles  
- 📱 **Responsive user interface** for all screen sizes  
- ⚙️ **Robust backend** built with Node.js, Express, and MongoDB  

---

## 🧱 System Architecture

Frontend (React + Vite)
↓
Backend (Node.js + Express)
↓
Database (MongoDB via Mongoose)


This three-layered design ensures modularity, scalability, and clean data flow.

---

## 🗂 Folder Structure

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


---

## 💡 Motivation

Every year, thousands of people struggle to find blood donors in emergencies.  
**BloodConnect** aims to solve this by building a digital bridge between **donors and recipients**, reducing search time and increasing the reach of blood donation drives.  

This project aligns with the **Winter of Code Social** mission — *using open source to create real social impact*.

---

## 🧰 Tech Stack

### Frontend ⚛️
- React (Vite)
- Tailwind CSS

### Backend 🧩
- Node.js & Express.js
- MongoDB (Mongoose)
- REST APIs for donor and request management

---

## 🚀 Quick Start

### Prerequisites 🧾
- Node.js (v20+ recommended)
- MongoDB (local or Atlas)
- Git

---

### Clone the Repository ⤵️

```bash
git clone https://github.com/darshan-totagi/blood-donation.git
cd BloodConnect
````

---

### Install Dependencies

**Server**

```bash
cd server
npm install
```

**Client**

```bash
cd ../client
npm install
```

---

### Environment Variables 🌿

There is already an **`.env.example`** file available in the `server` directory.

👉 **Steps:**

1. Open `server/.env.example`.
2. Add your credentials (MongoDB URI, secret key, etc.).
3. **Rename** the file from `.env.example` to `.env`.

Example:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
```

---

### Run in Development 🧑‍💻

Use two terminals:

```bash
# Terminal 1 - server
cd server
npm start
```

```bash
# Terminal 2 - client
cd client
npm run dev
```

---

### 🌐 Where It Runs

* **Frontend (React + Vite)** runs on 👉 [http://localhost:5173](http://localhost:5173) by default.
* **Backend (Express + Node.js)** runs on 👉 [http://localhost:5000](http://localhost:5000).

> The frontend communicates with the backend at `http://localhost:5000`.
> If you need to change the backend URL, update it inside `client/.env`.

Example for `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🧠 Future Enhancements

* 📍 Integrate Google Maps for nearby donor search
* 📬 Email/SMS notifications for urgent blood requests
* 🩺 Donation history and eligibility tracking
* 🧾 Role-based access for hospitals and organizations
* 💬 Chat interface for direct communication between donors and recipients

---

## 🤝 Contributing

We welcome contributions from everyone!
To contribute:

1. 🍴 Fork the repository
2. 🌿 Create a new branch (`feature/your-feature-name`)
3. 🧪 Make your changes and test locally
4. 💌 Open a Pull Request with a clear description

For **Winter of Code Social**, please follow the project’s contribution guidelines and mention your assigned issue or mentor in the PR.

---

👥 Contributors

Thanks to all amazing contributors under Winter of Code Social 2025 💪

<a href="https://github.com/darshan-totagi/blood-donation/graphs/contributors"> <img src="https://contrib.rocks/image?repo=darshan-totagi/blood-donation" /> </a>

---

## 📄 License

<div align="center">
  <strong>MIT License</strong>

  <p>This project is licensed under the MIT License. See the <code>LICENSE</code> file for details.</p>
</div>

---

## 💬 Support

<div align="center">
  <p>If you find this project helpful, please ⭐ star the repository to show your support.</p>
  <p>For quick discussions or collaboration, open an issue and tag the maintainers.</p>
</div>

---

Maintained under Winter of Code Social 2025 — building open-source solutions for social good 🩸
Contributor: Rudrapratapsinh Chauhan🧑‍🔧

```

