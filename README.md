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
5.  [Feature Comparison: Officer vs Beneficiary](#-feature-comparison-officer-vs-beneficiary)
6.  [Technical Architecture](#-technical-architecture)
7.  [Business Logic & Workflows](#-business-logic--workflows)
8.  [Detailed API Documentation](#-detailed-api-documentation)
9.  [Database Schema Deep-Dive](#-database-schema-deep-dive)
10. [Frontend Design System](#-frontend-design-system)
11. [Frontend Component Breakdown](#-frontend-component-breakdown)
12. [Security & Middleware](#-security--middleware)
13. [Error Handling & API Responses](#-error-handling--api-responses)
14. [Installation & Setup](#-installation--setup)
15. [Development Roadmap](#-development-roadmap)
16. [Troubleshooting & FAQ](#-troubleshooting--faq)
17. [Future Enhancements](#-future-enhancements)
18. [Author](#-author)

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
│   │   ├── announcementController.js # CRUD for Announcements
│   │   ├── authController.js         # Authentication logic (Signup/Login)
│   │   ├── beneficiaryController.js  # CRUD logic for Beneficiary data
│   │   ├── installmentController.js  # Installment & Ledger logic
│   │   ├── logController.js          # Audit & History log logic
│   │   ├── messageController.js      # Chat & Messaging logic
│   │   ├── notificationController.js # Notifications & Alert logic
│   │   └── ratingController.js       # Satisfaction Rating logic
│   ├── middleware/                   # Request Interceptors
│   │   └── verifyAuth.js             # JWT Verification & RBAC Guards
│   ├── models/                       # Data Models (Mongoose Schemas)
│   │   ├── Announcement.js           # Announcement Schema
│   │   ├── Beneficiary.js            # Beneficiary Schema (GeoJSON)
│   │   ├── Installment.js            # Financial Installment Schema
│   │   ├── Message.js                # Chat Message Schema
│   │   ├── Notification.js           # Alert Notification Schema
│   │   ├── Officer.js                # Officer Schema (RBAC)
│   │   ├── Rating.js                 # Feedback Rating Schema
│   │   └── StatusLog.js              # Audit & Status Tracking Schema
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
│   │   ├── login.css                 # Styling for Login Page
│   │   └── style.css                 # Global Design System (Tokens & Variables)
│   ├── js/                           # Global Frontend Logic
│   │   ├── auth.js                   # Token & Session management
│   │   └── sidebar.js                # Dynamic navigation rendering
│   ├── officer/                      # Officer Pages & Scripts
│   │   ├── activity-log.html         # Audit Log UI
│   │   ├── activity-log.js           # Audit Log Logic
│   │   ├── announcements.html        # Notice Board UI
│   │   ├── announcements.js          # Notice Board Logic
│   │   ├── beneficiary-detail.html   # Detailed Record View UI
│   │   ├── beneficiary-detail.js     # Detailed Record View Logic
│   │   ├── dashboard.js              # Stats fetching & rendering
│   │   ├── index.html                # Main Dashboard
│   │   ├── manage.html               # Records Management UI
│   │   ├── manage.js                 # Records Management Logic
│   │   ├── map.html                  # Geographical Overview UI
│   │   ├── map.js                    # Geographical Overview Logic
│   │   ├── register.html             # Beneficiary Registration UI
│   │   └── register.js               # Beneficiary Registration Logic
│   ├── user/                         # Beneficiary (User) Pages & Scripts
│   │   ├── details.html              # Full Profile UI
│   │   ├── index.html                # Application Status Page
│   │   ├── map.html                  # Personal House Location UI
│   │   ├── messages.html             # User-Officer Chat Interface UI
│   │   ├── messages.js               # User-Officer Chat Interface Logic
│   │   ├── notifications.html        # Status Alerts UI
│   │   ├── notifications.js          # Status Alerts Logic
│   │   ├── user-dashboard.js         # Beneficiary-specific data logic
│   │   ├── user-details.js           # Full profile view logic
│   │   └── user-map.js               # Personal location map logic
│   ├── login.html                    # Unified Login Portal
│   └── signup.html                   # Officer Onboarding
│
├── .gitignore                        # Files to exclude from Git
├── package.json                      # Root Workspace Configuration
└── README.md                         # Project Documentation
```

---

## 🔥 What's New: Advanced Features (v2.0 Expansion)
We have recently integrated nine critical functional enhancements to scale the MIS into a robust, enterprise-ready platform:
*   **✅ Eligibility Validation**: Automated pre-screening logic to ensure only eligible candidates are registered.
*   **📊 Backend Pagination & Filtering**: Optimized server-side data processing for handling large datasets efficiently without overloading the client.
*   **📜 Audit Log System**: Comprehensive tracking of all administrative actions for strict accountability and transparent governance.
*   **🔔 Real-Time Polling Notifications**: Instant alerts for officers and beneficiaries regarding status changes and updates.
*   **💬 User-Officer Chat Interface**: A built-in secure messaging channel facilitating direct communication between rural beneficiaries and district officers.
*   **⏱️ Project Completion Countdowns**: Dynamic countdown timers displaying estimated completion dates for active housing projects.
*   **⭐ Satisfaction Ratings**: Post-completion feedback mechanism allowing beneficiaries to rate their housing quality and officer support.
*   **💰 Installment Tracking**: Detailed ledger tracking financial disbursements in phases (e.g., Foundation, Lintel, Roof).
*   **📢 Announcements Notice Board**: Centralized broadcast system for officers to publish scheme guidelines and urgent notices.

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

## 📊 Feature Comparison: Officer vs Beneficiary

| Feature | Officer Portal | Beneficiary Portal |
| :--- | :---: | :---: |
| **View Dashboard Stats** | ✅ Full District Stats | ✅ Personal Status Only |
| **Register New Members** | ✅ Yes | ❌ No |
| **Update Project Status** | ✅ Yes | ❌ No |
| **Global Map View** | ✅ All Projects | ❌ No |
| **Personal Map View** | ✅ Yes | ✅ Yes |
| **Delete Records** | ✅ Yes (with Undo) | ❌ No |
| **Export PDF/Excel** | ✅ Yes | ❌ No |
| **Login Method** | Email + Password | Name + Name (Pwd) |

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
1. **Registration (v2.0 Validation)**: Officer inputs data. System validates eligibility (e.g., income thresholds) -> Saved as `Pending` with initial financial tracking setup.
2. **Construction**: Officer updates status to `Under Construction`.
   - **Trigger (v2.0)**: Audit log entry created. Notification queued for the beneficiary. Installment phase unlocks.
3. **Completion**: Officer marks as `Completed`.
   - **Trigger (v2.0)**: Marker turns Green. Beneficiary is prompted to submit a satisfaction rating.

### 3. Communication Workflow (v2.0)
- **Chat**: User sends a query -> Server stores message -> Officer's dashboard polls and receives message -> Officer replies directly.
- **Broadcast**: Officer publishes announcement -> Priority determines UI placement -> Users see it instantly on their notice board.

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

### **Communication & Audit Service (v2.0)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/messages` | Fetch or send chat messages between users and officers. |
| `GET/POST` | `/api/announcements` | Retrieve or broadcast scheme guidelines and updates. |
| `GET` | `/api/beneficiaries/:id/logs` | Fetch the complete audit trail of status changes for a record. |
| `GET` | `/api/notifications` | Long-polling endpoint for real-time status alerts. |

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
  officerId: { type: ObjectId, ref: 'Officer' },
  installments: { type: Array }, // Ledger of financial disbursements
  satisfactionRating: { type: Number, min: 1, max: 5 },
  completionDate: { type: Date } // Expected or actual completion date
}
```

### **3. Audit & Communication Schemas (v2.0)**
```javascript
// StatusLog Schema - For Audit Trails
{
  beneficiaryId: { type: ObjectId, ref: 'Beneficiary' },
  oldStatus: { type: String },
  newStatus: { type: String },
  changedBy: { type: ObjectId, ref: 'Officer' },
  timestamp: { type: Date, default: Date.now }
}

// Message Schema - For User-Officer Chat
{
  sender: { type: ObjectId, refPath: 'senderModel' },
  senderModel: { type: String, enum: ['Officer', 'Beneficiary'] },
  receiver: { type: ObjectId, refPath: 'receiverModel' },
  receiverModel: { type: String, enum: ['Officer', 'Beneficiary'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}

// Announcement Schema - For Notice Boards
{
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: ObjectId, ref: 'Officer' },
  priority: { type: String, enum: ['Low', 'High'], default: 'Low' },
  createdAt: { type: Date, default: Date.now }
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

## 🧩 Frontend Component Breakdown

### **1. Navigation & Layout**
- `sidebar.js`: Dynamically injects the sidebar into every page. It checks the user's role (Officer/User) to show appropriate links and highlights the active page based on the current URL.

### **2. Authentication Engine**
- `auth.js`: The central security hub for the frontend. It provides:
  - `getToken()`: Retrieves the JWT from `localStorage`.
  - `requireRole(role)`: Protects pages from unauthorized access by redirecting users if their role doesn't match.
  - `logout()`: Clears the session and redirects to the login page.

### **3. Records Engine**
- `manage.js`: A complex module handling the beneficiary table. It includes:
  - **Live Filtering**: Uses `.filter()` on the cached data for instant search results.
  - **Export Logic**: Integrates `jsPDF` and `XLSX` to process data into downloadable formats.
  - **Undo Banner**: Maintains a local state of `deletedRecords` for the restoration feature.

### **4. Geospatial Engine**
- `map.js`: Initializes the Leaflet map, fetches beneficiary coordinates, and creates custom HTML popups with dynamic status badges.

### **5. Real-Time Communication (v2.0)**
- `messages.js`: Powers the user-officer chat interface. Implements a polling mechanism to fetch new messages seamlessly without manual reloads.
- `announcements.js`: Drives the notice board, allowing officers to broadcast important updates which are rendered instantly on the beneficiary portal.

### **6. Accountability & Logging (v2.0)**
- `activity-log.js`: Renders the administrative audit trails. It provides a visual timeline of status changes for each project, indicating who made the change and when.
- `notifications.js`: A background service script that checks for new status updates or scheme alerts and displays non-intrusive toast notifications to the user.

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

### Phase 3: v2.0 Advanced Features (Completed)
- Integrated real-time polling notifications and messaging.
- Added comprehensive audit logs and notice boards.
- Implemented backend pagination and eligibility validation workflows.

### Phase 4: Accessibility & Scale (In Progress)
- [ ] Multi-lingual support (Hindi/English).
- [ ] Offline caching for rural areas.
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
