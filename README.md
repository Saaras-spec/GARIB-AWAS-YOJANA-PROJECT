# 🏠 Garib Awas Yojana — Comprehensive Rural Housing MIS

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-v5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Educational-brightgreen.svg)](LICENSE)

A high-performance, full-stack **Management Information System (MIS)** developed to automate the tracking and management of the **Garib Awas Yojana** rural housing scheme. This project facilitates the entire lifecycle of housing projects—from beneficiary registration and geo-tagging to real-time status updates and automated reporting.

---

## 📖 Table of Contents
1.  [Introduction](#-introduction)
2.  [Project Structure](#-project-structure)
3.  [Core Functionalities](#-core-functionalities)
4.  [Technical Architecture](#-technical-architecture)
5.  [Detailed API Documentation](#-detailed-api-documentation)
6.  [Database Schema Deep-Dive](#-database-schema-deep-dive)
7.  [Frontend Component Logic](#-frontend-component-logic)
8.  [Security & Middleware](#-security--middleware)
9.  [Installation & Setup](#-installation--setup)
10. [Future Enhancements](#-future-enhancements)
11. [Author](#-author)

---

## 🌟 Introduction
The **Garib Awas Yojana MIS** is designed as a centralized platform for government officers to manage housing projects across different districts. By leveraging modern web technologies like **Node.js**, **Express**, and **Leaflet.js**, it provides a seamless experience for both administrators and citizens.

---

## 📂 Project Structure
Below is the comprehensive directory structure of the project:

```text
GARIB-AWAS-YOJANA-PROJECT/
├── backend/                          # Server-side Application
│   ├── controllers/                  # Business Logic Layer
│   │   ├── authController.js         # Authentication logic (Signup/Login)
│   │   └── beneficiaryController.js  # CRUD logic for Beneficiary data
│   ├── middleware/                   # Request Interceptors
│   │   └── verifyAuth.js             # JWT Verification & RBAC Guards
│   ├── models/                       # Data Models (Mongoose Schemas)
│   │   ├── Beneficiary.js            # Beneficiary Schema (GeoJSON)
│   │   └── Officer.js                # Officer Schema (RBAC)
│   ├── routes/                       # Express Route Definitions
│   │   ├── api.js                    # Protected Application Routes
│   │   └── authRoutes.js             # Public Authentication Routes
│   ├── server.js                     # Express Entry Point & DB Connection
│   ├── package.json                  # Backend Dependencies
│   └── .env                          # Environment Configuration (Local only)
│
├── frontend/                         # Client-side Application (Vanilla JS)
│   ├── css/                          # Stylesheets
│   │   ├── auth.css                  # Specific styles for Login/Signup
│   │   └── style.css                 # Global Design System (Tokens & Variables)
│   ├── js/                           # Frontend Logic (Modules)
│   │   ├── auth.js                   # Token & Session management
│   │   ├── dashboard.js              # Stats fetching & rendering
│   │   ├── manage.js                 # Table CRUD & PDF/Excel Export
│   │   ├── map.js                    # Leaflet integration for Officers
│   │   ├── register.js               # Form handling & Validation
│   │   ├── sidebar.js                # Dynamic navigation rendering
│   │   ├── user-dashboard.js         # Beneficiary-specific data
│   │   ├── user-details.js           # Full profile view logic
│   │   └── user-map.js               # Personal location map
│   ├── officer/                      # Officer Pages
│   │   ├── index.html                # Main Dashboard
│   │   ├── manage.html               # Records Management
│   │   ├── map.html                  # Geographical Overview
│   │   └── register.html             # Beneficiary Registration
│   ├── user/                         # Beneficiary (User) Pages
│   │   ├── index.html                # Application Status Page
│   │   ├── details.html              # Full Profile
│   │   └── map.html                  # Personal House Location
│   ├── login.html                    # Unified Login Portal
│   └── signup.html                   # Officer Onboarding
│
├── .gitignore                        # Files to exclude from Git
├── package.json                      # Root Workspace Configuration
└── README.md                         # Project Documentation
```

---

## 🚀 Core Functionalities

### 👮 For Government Officers
*   **Centralized Stats**: Instantly view the distribution of projects (Pending, Construction, Completed).
*   **Geospatial Tracking**: Visualize every housing site on a map with status-coded markers.
*   **Inventory Management**: Full CRUD operations for beneficiary records.
*   **Data Export**: Download current records in **PDF** (via jsPDF) or **Excel** (via SheetJS) formats.
*   **Undo/Restore**: Accidental deletion recovery with a 15-second undo window.

### 👤 For Beneficiaries (Users)
*   **Simplified Login**: Accessible name-based login designed for rural usability.
*   **Status Transparency**: Real-time construction stage tracking.
*   **Officer Accountability**: Know exactly which officer is managing the project.

---

## 🛠️ Technical Architecture

### **Backend (Node.js & Express)**
*   **RESTful API**: Stateless architecture using standard HTTP methods.
*   **JWT Security**: Bearer token-based authentication with 24-hour expiration.
*   **Bcrypt Hashing**: 10-round salt hashing for all sensitive credentials.
*   **CORS**: Cross-Origin Resource Sharing enabled for secure frontend-backend communication.

### **Frontend (Vanilla JavaScript & CSS3)**
*   **Responsive Design**: Mobile-first UI using CSS Grid and Flexbox.
*   **Leaflet.js**: Lightweight mapping engine using OpenStreetMap tiles.
*   **Lucide Icons**: Scalable vector icons for a modern aesthetic.
*   **Fetch API**: Asynchronous data synchronization without page reloads.

---

## 📡 Detailed API Documentation

### **Authentication Service**
| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | `name, phone, email, district, state, password` | Registers a new administrative officer. |
| `POST` | `/api/auth/login` | `email/name, password, loginType` | Handles both Officer and Beneficiary logins. |

### **Administrative Service (Officer Only)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/beneficiaries` | Retrieves all records assigned to the logged-in officer. |
| `POST` | `/api/beneficiaries` | Adds a new beneficiary with GeoJSON coordinates. |
| `PUT` | `/api/beneficiaries/:id/status` | Transitions project status (e.g., Pending -> Completed). |
| `DELETE` | `/api/beneficiaries/:id` | Permanently removes a record from the database. |
| `GET` | `/api/statistics` | Aggregates counts for dashboard visualization. |

### **User Service**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/me` | Returns the profile data of the logged-in beneficiary. |

---

## 🗃️ Database Schema Deep-Dive

### **1. Officer Schema**
Stores the administrative credentials and district assignments.
```javascript
{
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true }, // Lowercase forced
  district: { type: String, required: true },
  state: { type: String, required: true },
  password: { type: String, required: true }, // Bcrypt Hashed
  role: { type: String, default: 'officer' }
}
```

### **2. Beneficiary Schema**
Core record storage utilizing **MongoDB 2dsphere indexes** for location tracking.
```javascript
{
  name: { type: String, required: true },
  age: { type: Number, required: true },
  income: { type: Number, required: true },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Construction', 'Completed'], 
    default: 'Pending' 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [longitude, latitude] // Standard GeoJSON
  },
  officerId: { type: ObjectId, ref: 'Officer' }
}
```

---

## 🛡️ Security & Middleware

### **JWT Verification (`verifyToken`)**
Every protected request must include an `Authorization: Bearer <token>` header. The server:
1.  Extracts the token from the header.
2.  Verifies the signature against `JWT_SECRET`.
3.  Attaches the decoded user payload to `req.user`.

### **Role Guard (`officerOnly`)**
Ensures that administrative routes (like creating or deleting beneficiaries) are only accessible to users with the `role: 'officer'`.

---

## 🚀 Installation & Setup

### **Prerequisites**
*   Node.js (v18+)
*   MongoDB (Compass or Atlas)
*   A Git-enabled terminal

### **Deployment Steps**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Saaras-spec/GARIB-AWAS-YOJANA-PROJECT.git
    cd GARIB-AWAS-YOJANA-PROJECT
    ```

2.  **Unified Installation**
    ```bash
    npm run install-all
    ```

3.  **Environment Setup**
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5001
    MONGODB_URI=your_mongodb_connection_uri
    JWT_SECRET=your_secure_random_string_2026
    ```

4.  **Run Locally**
    ```bash
    npm start
    ```
    The application will serve the frontend and backend on port **5001**.

---

## 🔮 Future Enhancements
- [ ] **Push Notifications**: Real-time alerts for beneficiaries on status changes.
- [ ] **Document Storage**: Integration with AWS S3 for storing ID proofs and house photos.
- [ ] **Multi-lingual Support**: Dashboard availability in Hindi and local regional languages.
- [ ] **Advanced Filtering**: District-wise and State-wise comparative analytics.

---

## 👨‍💻 Author

**Saaras**
*   [GitHub](https://github.com/Saaras-spec)
*   [Portfolio](https://saaras.dev) (Placeholder)

---
*Developed as part of the Advance Web Development Curriculum (Semester 4).*
