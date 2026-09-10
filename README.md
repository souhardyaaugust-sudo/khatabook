# Mini KhataBook – Full-Stack Ledger Management Application

A full-stack financial ledger management application built with **React.js, Node.js, Express.js, MongoDB, JWT Authentication, RESTful APIs, and CORS**.

![Mini KhataBook](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

- 🔐 **JWT Authentication & Security**: Secure user registration, login, session management, and password hashing with `bcryptjs`.
- 👥 **Customer Ledger Management**: Add, select, and delete customers with complete per-user data isolation.
- 💳 **Transaction Tracking**: Add credit ("You Got") and debit ("You Gave") entries with amounts, dates, and optional notes.
- 📊 **Dashboard & Financial Summaries**: Instant recalculations of customer credit totals, debit totals, net balances, and overall ledger totals.
- 💾 **Persistent MongoDB Storage**: Scalable database integration with Mongoose supporting MongoDB Atlas & local instances.
- ⚡ **Responsive React Interface**: Clean two-column layout with instant visual feedback and modular components.

---

## 🏗️ Project Architecture

```text
khatabook/
├── mini-khatabook/          # Frontend React (Vite)
│   ├── src/
│   │   ├── api.js           # REST API communication layer
│   │   ├── App.jsx          # Root dashboard component
│   │   ├── AuthModal.jsx    # Login / Register auth view
│   │   ├── CustomerPanel.jsx# Customer list panel
│   │   ├── EntrySection.jsx # Transaction entry form
│   │   └── EntryList.jsx    # Transaction history & balance
│   └── package.json
│
└── server/                  # Backend Node.js / Express
    ├── config/db.js         # Mongoose MongoDB connection
    ├── controllers/         # Auth, Customer, Transaction logic
    ├── middleware/          # JWT auth protect middleware
    ├── models/              # User, Customer, Transaction schemas
    ├── routes/              # Express API endpoints
    ├── index.js             # Server entrypoint
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas Connection String)

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/khatabook
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```
Start backend server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd mini-khatabook
npm install
```
Create a `.env` file in `mini-khatabook`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start frontend client:
```bash
npm run dev
```

---

## 🌐 Deployment Instructions

### Option A: Deploying MERN App (Recommended)
- **Frontend (React)**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) from the `mini-khatabook` folder.
- **Backend (Express)**: Deploy to [Render](https://render.com) or [Railway](https://railway.app) from the `server` folder.
- **Database (MongoDB)**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGO_URI` in your backend environment variables.

### Option B: Deploying Streamlit Python App
If you wish to deploy a Streamlit version on [Streamlit Community Cloud](https://streamlit.io/cloud):
1. Connect your GitHub repository.
2. Select the main Python script (`app.py`).
3. Add secrets (`MONGO_URI`, `JWT_SECRET`) in Streamlit Cloud Dashboard settings.

---

## 📄 License
This project is open-source under the MIT License.
