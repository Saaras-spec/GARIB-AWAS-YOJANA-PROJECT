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
4.  [User Personas & Target Audience](#-user-personas--target-audience)
5.  [Technical Architecture](#-technical-architecture)
6.  [Business Logic & Workflows](#-business-logic--workflows)
7.  [Detailed API Documentation](#-detailed-api-documentation)
8.  [Database Schema Deep-Dive](#-database-schema-deep-dive)
9.  [Frontend Design System](#-frontend-design-system)
10. [Frontend Component Logic](#-frontend-component-logic)
11. [Security & Middleware](#-security--middleware)
12. [Error Handling & API Responses](#-error-handling--api-responses)
13. [Installation & Setup](#-installation--setup)
14. [Development Roadmap](#-development-roadmap)
15. [Troubleshooting & FAQ](#-troubleshooting--faq)
16. [Future Enhancements](#-future-enhancements)
17. [Author](#-author)

---

## 🌟 Introduction
The **Garib Awas Yojana MIS** is designed as a centralized platform for government officers to manage housing projects across different districts. By leveraging modern web technologies like **Node.js**, **Express**, and **Leaflet.js**, it provides a seamless experience for both administrators and citizens. This system aims to eliminate the inefficiencies of manual record-keeping and provide transparent data to all stakeholders.

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
*   **Centralized Stats**: Instantly view the distribution of projects (Pending, Construction, Completed) using a real-time dashboard.
*   **Geospatial Tracking**: Visualize every housing site on a map with status-coded markers for better planning.
*   **Inventory Management**: Full CRUD operations for beneficiary records with advanced search and filtering.
*   **Data Export**: Download current records in **PDF** (via jsPDF) or **Excel** (via SheetJS) formats for offline auditing.
*   **Undo/Restore**: Accidental deletion recovery with a 15-second undo window to prevent data loss.

### 👤 For Beneficiaries (Users)
*   **Simplified Login**: Accessible name-based login designed for rural usability, requiring zero password memorization.
*   **Status Transparency**: Real-time construction stage tracking to keep citizens informed.
*   **Officer Accountability**: Know exactly which officer is managing the project and their contact district.

---

## 👥 User Personas & Target Audience

### 1. District Administrative Officer (DAO)
- **Role**: Overlooks the implementation of the housing scheme at a district level.
- **Goals**: Register eligible citizens, update construction milestones, and report progress to state authorities.
- **Pain Points**: Difficulty in visiting remote sites and maintaining physical files.
- **Solution**: The MIS provides a digital dashboard and GPS-enabled tracking.

### 2. Rural Beneficiary
- **Role**: A citizen eligible for housing assistance.
- **Goals**: Check the status of their application and know when they can move into their new home.
- **Pain Points**: Lack of information and need to travel to district offices for updates.
- **Solution**: A mobile-friendly personal portal accessible via a simple name-based login.

---

## 🛠️ Technical Architecture

### **Backend (Node.js & Express)**
*   **RESTful API**: Stateless architecture using standard HTTP methods for cross-platform compatibility.
*   **JWT Security**: Bearer token-based authentication with 24-hour expiration for secure sessions.
*   **Bcrypt Hashing**: 10-round salt hashing for all sensitive officer credentials.
*   **CORS**: Cross-Origin Resource Sharing enabled for secure frontend-backend communication across domains.

### **Frontend (Vanilla JavaScript & CSS3)**
*   **Responsive Design**: Mobile-first UI using CSS Grid and Flexbox for accessibility on low-end devices.
*   **Leaflet.js**: Lightweight mapping engine using OpenStreetMap tiles for high-performance geospatial data rendering.
*   **Lucide Icons**: Scalable vector icons for a modern, clean, and professional aesthetic.
*   **Fetch API**: Asynchronous data synchronization without page reloads for a "Single Page App" feel.

---

## 🔄 Business Logic & Workflows

### 1. Authentication Workflow
- **Signup**: Officer provides details -> Password hashed -> Stored in MongoDB.
- **Login**: Credentials verified -> JWT signed with `JWT_SECRET` -> Token returned to client -> Stored in `localStorage`.
- **Authorization**: Token sent in `Authorization` header -> Verified by `verifyAuth` middleware -> Request allowed.

### 2. Beneficiary Management Lifecycle
1. **Registration**: Officer inputs data + GPS coordinates -> Saved as `Pending`.
2. **Construction**: Officer updates status to `Under Construction` -> Marker on map turns Yellow.
3. **Completion**: Officer marks as `Completed` -> Marker turns Green -> Record finalized.

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

## 🎨 Frontend Design System

### **Color Palette**
- **Primary (Officer)**: `#000080` (Navy Blue) - Represents authority and trust.
- **Secondary**: `#f8f9fa` (Light Gray) - Background for clean readability.
- **Status Colors**:
  - `Pending`: `#dc3545` (Red)
  - `Under Construction`: `#ffc107` (Amber)
  - `Completed`: `#28a745` (Green)

### **Typography**
- **Headings**: `Outfit`, sans-serif - Modern and professional.
- **Body**: `Inter`, sans-serif - Optimized for high legibility.

---

## 🛡️ Security & Middleware

### **JWT Verification (`verifyToken`)**
Every protected request must include an `Authorization: Bearer <token>` header. The server:
1.  Extracts the token from the header using `split(' ')[1]`.
2.  Verifies the signature against the server-side `JWT_SECRET`.
3.  Attaches the decoded user payload (id, role, name) to `req.user`.

### **Role Guard (`officerOnly`)**
Ensures that administrative routes (like creating or deleting beneficiaries) are only accessible to users where `req.user.role === 'officer'`. This prevents unauthorized users from manipulating data.

---

## ⚠️ Error Handling & API Responses

The API uses standard HTTP status codes to communicate success or failure:

*   **200 OK**: Request succeeded and returned data.
*   **201 Created**: Resource (Officer or Beneficiary) successfully created.
*   **400 Bad Request**: Validation failed (missing fields, invalid data format).
*   **401 Unauthorized**: No token provided or token has expired.
*   **403 Forbidden**: Token is valid but user lacks the required role (e.g., a beneficiary trying to access officer stats).
*   **404 Not Found**: The requested resource or API endpoint does not exist.
*   **500 Internal Server Error**: An unexpected server-side error occurred.

**Example Error Response:**
```json
{
  "error": "Access denied. Officers only."
}
```

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

## 🗺️ Development Roadmap

### Phase 1: Foundation (Completed)
- Core Express server setup.
- Authentication system (JWT + Bcrypt).
- Basic CRUD for beneficiaries.

### Phase 2: Enhanced UI (Completed)
- Responsive Glassmorphism dashboard.
- Leaflet map integration with color-coded markers.
- Multi-format data export (PDF/Excel).

### Phase 3: Accessibility & UX (In Progress)
- [ ] Multi-lingual support (Hindi/English).
- [ ] Offline caching for rural areas.
- [ ] Form auto-save features.

### Phase 4: Scale (Future)
- [ ] Cloud storage integration for project photos.
- [ ] AI-based eligibility scoring.

---

## ❓ Troubleshooting & FAQ

**Q: The map isn't loading.**
- Check if you have an active internet connection (tiles are loaded from CARTO CDNs).
- Ensure `Leaflet.js` is correctly linked in your HTML files.

**Q: I get a 401 Unauthorized error.**
- Your session might have expired. Try logging out and logging back in to refresh your JWT token.

**Q: Can I run this without MongoDB?**
- Yes! If you don't provide a `MONGODB_URI` in your `.env`, the server will automatically use an in-memory database for testing.

---

## 🔮 Future Enhancements
- [ ] **Push Notifications**: Real-time alerts for beneficiaries on status changes using Webhooks.
- [ ] **Document Storage**: Integration with AWS S3 or Cloudinary for storing ID proofs and construction site photos.
- [ ] **Multi-lingual Support**: Dashboard availability in Hindi and local regional languages to bridge the language gap.
- [ ] **Advanced Filtering**: District-wise and State-wise comparative analytics for high-level government reporting.
- [ ] **AI Audit**: Automated verification of income documents using OCR (Optical Character Recognition).

---

## 👨‍💻 Author

**Saaras**
*   [GitHub](https://github.com/Saaras-spec)
*   [Portfolio](https://saaras.dev) (Placeholder)

---
*Developed as part of the Advance Web Development Curriculum (Semester 4).*
