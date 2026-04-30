# 🏠 Garib Awas Yojana — Rural Housing MIS

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/Express-v5-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Educational-orange.svg)](LICENSE)

A state-of-the-art **Management Information System (MIS)** designed to streamline the administration of India's rural housing initiative, **Garib Awas Yojana**. This platform bridges the gap between government administration and citizens, ensuring transparency, real-time tracking, and efficient resource allocation.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technical Architecture](#-technical-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Installation & Setup](#-installation--setup)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🎯 Project Overview

The **Garib Awas Yojana MIS** is a full-stack solution built to solve the challenges of tracking rural housing projects. Traditionally, managing thousands of housing applications manually leads to delays and data inconsistencies. This platform provides:
- **For Officers**: A command center to register beneficiaries, monitor project stages via maps, and generate reports.
- **For Beneficiaries**: A simple, accessible portal to check their application status without visiting government offices.

---

## ✨ Key Features

### 👮 Officer Command Center
- **Dynamic Dashboard**: Real-time visualization of project distribution (Pending vs. Completed).
- **Geospatial Tracking**: Integrated **Leaflet.js** map showing every project site with status-based color coding.
  - 🔴 **Pending**: Initial registration phase.
  - 🟡 **Under Construction**: Foundation or structure in progress.
  - 🟢 **Completed**: House handed over to the beneficiary.
- **Advanced Management**: Search, filter by district/income, and update project status with a single click.
- **Export Capabilities**: Generate professional PDF reports and Excel sheets for offline auditing.

### 👤 Beneficiary Portal
- **Zero-Password Login**: Simple name-based authentication for ease of use in rural areas.
- **Personalized Tracking**: Real-time view of their house's construction stage.
- **Officer Connectivity**: Transparent information about the assigned officer in charge of their project.

### 🛡️ Security & Reliability
- **JWT-Based Authentication**: Secure, stateless sessions for both officers and users.
- **Role-Based Access Control (RBAC)**: Strict separation of duties ensuring only authorized officers can modify data.
- **In-Memory Fallback**: Seamless development experience with automatic `mongodb-memory-server` activation if no database URI is provided.

---

## 🛠️ Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JS / CSS3 | High performance, no-build-step architecture. |
| **Backend** | Node.js / Express 5 | Modern, asynchronous request handling. |
| **Database** | MongoDB / Mongoose | Flexible document storage for complex beneficiary data. |
| **Mapping** | Leaflet.js / CARTO | Geospatial visualization of housing projects. |
| **Icons** | Lucide Icons | Clean, lightweight SVG iconography. |

---

## 🗃️ Database Schema

### 📋 Beneficiary Model
The heart of the application, utilizing **GeoJSON** for location tracking.
```javascript
{
  name: String,          // Lowercase for search optimization
  age: Number,
  income: Number,        // Annual income for eligibility tracking
  address: String,
  status: String,        // ["Pending", "Under Construction", "Completed"]
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  officerId: ObjectId    // Reference to the managing officer
}
```

### 📋 Officer Model
Handles administrative access and district-wise grouping.
```javascript
{
  name: String,
  email: String,         // Unique identifier
  password: String,      // Hashed with bcryptjs
  district: String,
  state: String,
  role: "officer"
}
```

---

## 📡 API Documentation

### 🔑 Authentication
- `POST /api/auth/signup` - Register a new administrative officer.
- `POST /api/auth/login` - Unified login for both officers and beneficiaries.

### 🏠 Beneficiary Operations (Officer Only)
- `GET /api/beneficiaries` - Fetch all beneficiaries assigned to the logged-in officer.
- `POST /api/beneficiaries` - Onboard a new citizen into the scheme.
- `PUT /api/beneficiaries/:id/status` - Transition a project through construction stages.
- `DELETE /api/beneficiaries/:id` - Remove a record (with soft-delete/undo support in UI).

### 📊 Analytics & Profile
- `GET /api/statistics` - Aggregate counts for dashboard charts.
- `GET /api/user/me` - Profile retrieval for the logged-in beneficiary.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- MongoDB (Optional, will use in-memory DB if not provided)

### Step-by-Step Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Saaras-spec/GARIB-AWAS-YOJANA-PROJECT.git
   cd GARIB-AWAS-YOJANA-PROJECT
   ```

2. **Install Dependencies**
   The project uses a root-level script to install both frontend and backend requirements.
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   Create `backend/.env`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key_2026
   ```

4. **Run Application**
   ```bash
   npm start
   ```
   Access the portal at `http://localhost:5001`.

---

## 🔮 Future Enhancements
- [ ] **Document Upload**: Allow beneficiaries to upload ID proofs directly via the portal.
- [ ] **SMS Notifications**: Automated SMS alerts when a house transitions to "Completed" status.
- [ ] **Offline Mode**: Progressive Web App (PWA) support for officers in remote areas with poor connectivity.
- [ ] **AI Eligibility Check**: Automatic verification of income vs. family size for scheme eligibility.

---

## 👨‍💻 Author

**Saaras**
- 🌟 [GitHub Profile](https://github.com/Saaras-spec)
- 📧 [Contact](mailto:your-email@example.com)

---
*Created for the Advance Web Development Project (Semester 4).*
