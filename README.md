# 🏠 Garib Awas Yojana — Management Information System

A full-stack web application for managing India's rural housing scheme (**Garib Awas Yojana**). The platform enables government officers to register, track, and manage housing beneficiaries while providing beneficiaries with a personal dashboard to view their application status, assigned officer, and project progress.

---

## ✨ Features

### 👮 Officer Portal
- **Dashboard** — Real-time statistics: total enrolled, pending, under construction, and completed housing projects.
- **Beneficiary Registration** — Register new beneficiaries with name, age, family members, income, address, and geo-coordinates.
- **Beneficiary Management** — View, update status (`Pending` → `Under Construction` → `Completed`), and delete beneficiary records.
- **Interactive Map** — Leaflet-powered map with color-coded markers (🔴 Pending, 🟡 Under Construction, 🟢 Completed) showing beneficiary locations.

### 👤 User (Beneficiary) Portal
- **Personal Dashboard** — View application status, assigned officer name, and current project stage.
- **Details Page** — Full beneficiary profile with all registered information.
- **Location Map** — Personal map view showing the beneficiary's housing location.

### 🔐 Authentication & Security
- **Role-based access** — Separate login flows for Officers (email + password) and Users (name-based).
- **JWT authentication** — Secure token-based sessions with 24-hour expiry.
- **Password hashing** — Officer passwords hashed with bcryptjs.
- **Protected API routes** — Middleware-enforced authorization; officer-only endpoints for CRUD operations.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Lucide Icons, Leaflet.js   |
| **Backend**  | Node.js, Express.js (v5)                                    |
| **Database** | MongoDB (via Mongoose ODM), with optional in-memory fallback|
| **Auth**     | JSON Web Tokens (JWT), bcryptjs                             |
| **Others**   | dotenv, CORS                                                |

---

## 📁 Project Structure

```
GARIB-AWAS-YOJANA-PROJECT/
│
├── backend/                          # Server-side application
│   ├── controllers/
│   │   ├── authController.js         # Signup & login logic (Officer + User)
│   │   └── beneficiaryController.js  # CRUD operations for beneficiaries
│   │
│   ├── middleware/
│   │   └── auth.js                   # JWT verification & officer-only guard
│   │
│   ├── models/
│   │   ├── Beneficiary.js            # Beneficiary schema (GeoJSON location)
│   │   └── Officer.js                # Officer schema
│   │
│   ├── routes/
│   │   ├── api.js                    # Protected beneficiary & statistics routes
│   │   └── auth.js                   # Auth routes (signup, login)
│   │
│   ├── fix-officer-assignment.js     # One-time migration script
│   ├── server.js                     # Express server entry point
│   ├── package.json                  # Backend dependencies
│   └── package-lock.json
│
├── frontend/                         # Client-side application
│   ├── css/
│   │   ├── auth.css                  # Authentication page styles
│   │   └── style.css                 # Global application styles
│   │
│   ├── js/
│   │   ├── auth.js                   # Token management & auth helpers
│   │   ├── dashboard.js              # Officer dashboard statistics
│   │   ├── manage.js                 # Beneficiary table management
│   │   ├── map.js                    # Officer map (all beneficiaries)
│   │   ├── register.js               # Beneficiary registration form
│   │   ├── sidebar.js                # Dynamic sidebar injection
│   │   ├── user-dashboard.js         # User dashboard data fetch
│   │   ├── user-details.js           # User details page logic
│   │   └── user-map.js               # User personal map view
│   │
│   ├── officer/                      # Officer pages
│   │   ├── index.html                # Officer dashboard
│   │   ├── manage.html               # Manage beneficiaries
│   │   ├── map.html                  # Map view
│   │   └── register.html             # Register beneficiary
│   │
│   ├── user/                         # Beneficiary (User) pages
│   │   ├── index.html                # User dashboard
│   │   ├── details.html              # User details
│   │   └── map.html                  # User map view
│   │
│   ├── login.html                    # Login page (Officer & User toggle)
│   └── signup.html                   # Officer registration page
│
├── .gitignore
├── package.json                      # Root package (install & start scripts)
├── start-portal.sh                   # One-click startup script (macOS/Linux)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saaras-spec/GARIB-AWAS-YOJANA-PROJECT.git
   cd GARIB-AWAS-YOJANA-PROJECT
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**

   Create a `.env` file inside the `backend/` directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/garib-awas
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   ```
   > **Note:** If no `MONGODB_URI` is provided, the server will automatically spin up an in-memory MongoDB instance for local development.

4. **Start the server**
   ```bash
   npm start
   ```
   The app will be available at **http://localhost:5001**

### Quick Start (macOS/Linux)
```bash
chmod +x start-portal.sh
./start-portal.sh
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description              | Access  |
| ------ | ------------------- | ------------------------ | ------- |
| POST   | `/api/auth/signup`  | Register a new officer   | Public  |
| POST   | `/api/auth/login`   | Login (Officer or User)  | Public  |

### Beneficiary Management
| Method | Endpoint                        | Description                  | Access       |
| ------ | ------------------------------- | ---------------------------- | ------------ |
| GET    | `/api/beneficiaries`            | List all beneficiaries       | Officer only |
| POST   | `/api/beneficiaries`            | Register new beneficiary     | Officer only |
| PUT    | `/api/beneficiaries/:id/status` | Update beneficiary status    | Officer only |
| DELETE | `/api/beneficiaries/:id`        | Remove a beneficiary         | Officer only |
| GET    | `/api/statistics`               | Dashboard statistics         | Officer only |
| GET    | `/api/user/me`                  | Get logged-in user's data    | Authenticated|

---

## 🗃️ Database Models

### Officer
| Field      | Type   | Description              |
| ---------- | ------ | ------------------------ |
| name       | String | Officer's full name      |
| phone      | String | Contact number           |
| email      | String | Unique email (lowercase) |
| district   | String | Assigned district        |
| state      | String | State                    |
| password   | String | Hashed password          |
| role       | String | Always `"officer"`       |
| createdAt  | Date   | Registration timestamp   |

### Beneficiary
| Field         | Type     | Description                              |
| ------------- | -------- | ---------------------------------------- |
| name          | String   | Beneficiary name (lowercase)             |
| age           | Number   | Age                                      |
| familyMembers | Number   | Number of family members                 |
| income        | Number   | Annual income                            |
| address       | String   | Residential address                      |
| status        | String   | `Pending` / `Under Construction` / `Completed` |
| location      | GeoJSON  | Point coordinates `[lng, lat]`           |
| officerId     | ObjectId | Reference to the assigned Officer        |
| createdAt     | Date     | Registration timestamp                   |

---

## 📜 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Saaras** — [GitHub](https://github.com/Saaras-spec)
