# The BookMarket — Peer-to-Peer Second-Hand Book Marketplace

> A production-ready, peer-to-peer second-hand book marketplace SaaS built on the modern MERN stack. Designed with defensive backend engineering, relational Mongoose schemas with compound and text search indexes, JWT authentication, and a responsive React frontend.

---

## 🚀 Live Deployments & Health Check

| Service | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | `https://bookmarket-client.vercel.app` |
| **Backend API** | Render | `https://the-bookmarket-api.onrender.com` |
| **API Healthcheck** | Render | `https://the-bookmarket-api.onrender.com/health` |

> ⏳ **Render Cold-Start Notice**: If accessing the live backend after a period of inactivity on the Render free tier, the first request may take **40–60 seconds** while the instance spins up. Subsequent requests respond instantly.

---

## 🔑 Evaluator Demo Accounts

The database seed script automatically populates realistic listings along with two test accounts:

| Role | Email | Password | Pre-seeded Inventory |
| :--- | :--- | :--- | :--- |
| **Demo Seller** | `seller@bookmarket.com` | `password123` | 6 Books across Engineering, Fiction, Non-Fiction, Comics |
| **Demo Buyer / Seller** | `buyer@bookmarket.com` | `password123` | 4 Books across Sci-Fi, GRE Exam Prep, Manga |

*Note: On the login page, click the **1-Click Fill** buttons to automatically populate either demo account.*

---

## 📦 Project Architecture & Directory Structure

```text
mern-end-term/
├── client/                     # Vite + React 18 + Tailwind CSS frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # Centralized Axios instance with JWT interceptor
│   │   ├── components/         # Reusable UI (Navbar, BookCard, FilterSidebar, Modals)
│   │   ├── context/            # AuthContext (user, login, register, logout)
│   │   ├── pages/              # HomePage, BookDetailsPage, DashboardPage, Login, Register
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json             # Single-Page Application rewrites for Vercel
│   └── vite.config.js
│
├── server/                     # Node.js + Express + MongoDB backend
│   ├── config/
│   │   └── db.js               # Resilient MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js   # Registration, JWT authentication, current session
│   │   ├── bookController.js   # Filtered search, CRUD, status mutation, listings
│   │   └── userController.js   # Public seller profile queries
│   ├── middleware/
│   │   ├── auth.js             # Bearer JWT protection middleware
│   │   └── errorHandler.js     # Centralized error handler (CastError, 11000, JWT)
│   ├── models/
│   │   ├── User.js             # User model with email uniqueness & password exclusion
│   │   └── Book.js             # Full-text search & compound indexed Book model
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── bookRoutes.js       # /api/books routes
│   ├── seeds/
│   │   └── seed.js             # Seeding script with 10 realistic books & 2 accounts
│   ├── .env.example
│   ├── index.js                # Express app (Helmet, CORS, Rate Limit, Trust Proxy)
│   └── package.json
│
├── .gitignore
├── package.json                # Monorepo root scripts
└── README.md
```

---

## 🛠️ API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user; returns signed JWT and user data |
| `POST` | `/api/auth/login` | Public | Authenticate user; returns signed JWT and user data |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated user profile |

### Book Marketplace (`/api/books`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Public | Public catalog search. Supports `search`, `genre`, `condition`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` |
| `GET` | `/api/books/:id` | Public | Fetch book details with populated seller contact info |
| `GET` | `/api/books/my/listings` | Protected | Fetch current seller's books, incoming buyer inquiries & sales statistics |
| `GET` | `/api/books/my/inquiries` | Protected | Fetch current buyer's direct purchase inquiries with seller contact details |
| `POST` | `/api/books` | Protected | Create new book listing attached to logged-in user |
| `POST` | `/api/books/:id/inquire` | Protected | Submit direct peer purchase inquiry (shares buyer name, phone, meetup spot) |
| `PATCH` | `/api/books/:id/status` | Protected | Update listing status (`available`, `reserved`, `sold`). Restricted to owner |
| `PATCH` | `/api/books/:bookId/inquiries/:inquiryId` | Protected | Accept, complete, or decline incoming buyer purchase inquiry |
| `DELETE` | `/api/books/:id` | Protected | Delete listing. Restricted to owner |

### System & Health
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Service liveness check `{ status: 'ok', uptime, timestamp }` |

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas connection string

### 2. Installation
Clone the repository and install dependencies:
```bash
# Install root, backend, and frontend packages
npm run install:all
```
*(Alternatively: `cd server && npm install && cd ../client && npm install`)*

### 3. Environment Variables Configuration
Configure `.env` in both `server/` and `client/`:

**`server/.env`**:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookmarket
JWT_SECRET=super_secret_jwt_key_bookmarket_dev_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`client/.env`**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Database Seeding
Populate the database with demo users and realistic book listings across diverse genres:
```bash
npm run seed
```

### 5. Running the Application Locally (1-Command Scripts)
You can launch, stop, and inspect the entire platform with our production-grade scripts:

```bash
# 🚀 Start MongoDB, Backend (5000), and Frontend (5173) in one shot:
./start-local.sh
# or via npm:
npm run start:local

# 📋 Check real-time service health & ports:
./status-local.sh
# or via npm:
npm run status:local

# 🛑 Cleanly stop both backend and frontend:
./stop-local.sh
# or via npm:
npm run stop:local
```

*(Alternatively, run backend and frontend separately in two terminals using `npm run server` and `npm run client`.)*

### 6. Automated Integration Tests
Execute the 29-test integration test suite against the backend API:
```bash
npm test
```

---

## 🛡️ Production & Security Engineering Features
- **Reverse Proxy Resilience**: Configured `app.set('trust proxy', 1)` to accurately read client IPs through Render/Cloudflare proxies.
- **HTTP Security Headers**: Powered by `helmet()`.
- **Payload Sanitization & Protection**: Express JSON body size restricted to `10kb` to thwart body-flood DoS attempts.
- **Rate Limiting**: Enforced with `express-rate-limit` (150 requests per 15-minute sliding window).
- **Indexing & Query Performance**:
  - Full-text search index on `{ title: 'text', author: 'text', description: 'text' }`.
  - Compound index on `{ status: 1, genre: 1, price: 1 }` for high-throughput filter combinations.
- **Defensive Error Handling**: Centralized error middleware handling Mongoose `CastError`, duplicate key `11000`, validation failures, and expired/malformed JWTs with clean JSON payloads.
- **Peer-to-Peer WhatsApp Integration**: Pre-populated one-click WhatsApp redirection (`https://wa.me/<phone>?text=...`) mentioning book title and price with a fallback `mailto:` client link.
