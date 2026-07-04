# ERP Cloud AI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)

A full-stack cloud ERP (Enterprise Resource Planning) system with role-based access control, a drag-and-drop dashboard builder, and modules covering HR, Finance, Supply Chain, Projects, Notifications, and more.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Module Features](#module-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Build Commands](#build-commands)
- [Development Workflow](#development-workflow)
- [API Overview](#api-overview)
- [Authentication Flow](#authentication-flow)
- [Seed Data](#seed-data)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)


---

## Project Overview

ERP Cloud AI is a modern enterprise management platform built for small-to-medium organisations. It provides a unified interface for managing employees, payroll, finance transactions, inventory, purchase orders, projects, and system notifications — all behind a JWT-authenticated role-based access system.

Key characteristics:

- **Multi-role access control** — five roles (admin, hr, finance, manager, employee) with per-endpoint authorization
- **Persisted dashboard** — per-user widget layout saved in MongoDB with drag-and-drop reordering
- **Audit trail** — every mutating API call is automatically logged with user, method, route, and timestamp
- **Payroll engine** — server-side salary computation with allowance/deduction validation
- **Organisation Chart** — seniority-sorted department view served from a dedicated endpoint
- **Tenant settings** — company-level configuration (currency, timezone, approval limits, MFA flag)

---

## Module Features

### Authentication

- Register new accounts (all new users default to the `employee` role)
- Login with email and password — returns a signed JWT valid for 7 days
- View and edit your own profile
- Change password (requires current password)
- Role promotion can only be performed by an admin via the Users API

### Dashboard

- Drag-and-drop widget builder (10 widget types)
- Per-user layout persisted in MongoDB
- Widgets include: headcount, revenue, inventory alerts, attendance summary, and more
- Low-stock inventory alerts with configurable reorder thresholds

### Human Resources

| Sub-module | Features |
|---|---|
| **Employees** | Full CRUD (admin only), searchable list, employee detail page with attendance and leave history |
| **Attendance** | Log check-in/check-out, mark Present/Absent, filter by employee |
| **Leave** | Submit leave requests, approve/reject workflow (HR/manager role), Pending/Approved/Rejected status |
| **Payroll** | Create and manage payroll records, server-side net salary computation (basicSalary + allowances − deductions) |
| **Payslips** | Generate payslips from payroll records, Draft/Issued/Cancelled lifecycle |
| **Organisation Chart** | Department-grouped view with seniority-sorted employees, served from `/api/hr/organisation` |

### Finance

- General Ledger (GL), Accounts Payable (AP), Accounts Receivable (AR), and Payment transaction types
- Status workflow: **Draft → Pending → Approved → Paid**
- Full CRUD for transactions with pagination

### Supply Chain

- **Inventory management** — SKU, stock levels, reorder level, unit cost, vendor, Active/Inactive status
- **Purchase Orders** — PO number, vendor, item, quantity, status workflow: **Draft → Sent → Received → Cancelled**
- Low-stock alert surfaced on the dashboard when stock falls below reorder level

### Projects

- Project portfolio with code, name, owner, budget, actual spend, and progress percentage
- Status types: Planning, Active, On Hold, Completed
- Inline progress bar display

### Reports

Three-tab reporting interface:

1. **BI Report Builder** — aggregate summary across employees, attendance, payroll, finance, inventory, and projects
2. **Audit Trail** — paginated log of all mutating API calls (admin-only tab)
3. **Metrics Overview** — key counts and totals across the system

### Notifications

- Create alerts with title, message, channel (In-App / Email / SMS / Webhook), and severity (Info / Warning / Critical)
- List all notifications with Unread/Read status
- Mark individual notifications as read

### Settings

- Tenant-level configuration stored in MongoDB (one record per deployment)
- Fields: Company Name, Tenant Code, Base Currency, Timezone, Approval Limit, MFA Required, Email Notifications
- Admin-only write access; all authenticated users can read

### Profile

- View account details (name, email, role, member since)
- Inline name editing via profile drawer (slide-out panel) or dedicated profile page
- Changes persisted to the database and reflected in the active session immediately

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Static typing |
| Vite | 8 | Build tool and dev server |
| React Router | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | 3.x | Chart components |
| React Icons | 5.x | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 5 | Web framework |
| TypeScript | 6 | Static typing |
| Mongoose | 9 | MongoDB ODM |
| MongoDB | 7+ | Database |
| jsonwebtoken | 9 | JWT signing and verification |
| bcryptjs | 3 | Password hashing |
| cors | 2.x | Cross-origin resource sharing |
| dotenv | 17 | Environment variable loading |

---

## Architecture

```
Browser (React SPA)
        │
        │  HTTP /api/*  (proxied in dev by Vite → localhost:1000)
        ▼
Express Server  :1000
        │
        ├── auditMiddleware  (logs all POST/PUT/DELETE mutations)
        │
        ├── /api/auth           authRoutes
        ├── /api/users          userRoutes
        ├── /api/hr             hrRoutes
        │       ├── employees
        │       ├── attendance
        │       ├── leave
        │       ├── payroll
        │       ├── payslips
        │       └── organisation
        ├── /api/finance        financeRoutes
        ├── /api/supply-chain   supplyChainRoutes
        ├── /api/projects       projectRoutes
        ├── /api/notifications  notificationRoutes
        ├── /api/settings       settingsRoutes
        ├── /api/reports        reportRoutes
        ├── /api/dashboard      dashboardConfigRoutes
        └── /api/audit-logs     auditLogRoutes
                │
                ▼
           MongoDB (Mongoose 9)
```

**API URL strategy:**

- In development, the Vite dev server proxies `/api/*` to `http://localhost:1000/api/*`, eliminating CORS issues.
- The frontend reads `VITE_API_URL` from the environment. The default value is `/api` (uses the proxy).
- In production, set `VITE_API_URL` to the full backend URL (e.g. `https://api.yourdomain.com/api`).

---

## Folder Structure

```
erp-ai-cloud-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts           # MongoDB connection (exits on failure)
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts     # protect + authorize
│   │   │   └── auditMiddleware.ts    # mutation audit logger
│   │   ├── models/
│   │   │   ├── hr/
│   │   │   │   ├── Employee.ts
│   │   │   │   ├── Attendance.ts
│   │   │   │   ├── LeaveRequest.ts
│   │   │   │   ├── Payroll.ts
│   │   │   │   └── Payslip.ts
│   │   │   ├── AuditLog.ts
│   │   │   ├── DashboardConfig.ts
│   │   │   ├── FinanceTransaction.ts
│   │   │   ├── InventoryItem.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Project.ts
│   │   │   ├── PurchaseOrder.ts
│   │   │   ├── TenantSetting.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── hr/                   # HR sub-routes index
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── financeRoutes.ts
│   │   │   ├── supplyChainRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   ├── notificationRoutes.ts
│   │   │   ├── settingsRoutes.ts
│   │   │   ├── reportRoutes.ts
│   │   │   ├── dashboardConfigRoutes.ts
│   │   │   └── auditLogRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── hr/
│   │   │       ├── attendanceService.ts
│   │   │       ├── employeeService.ts
│   │   │       ├── leaveService.ts
│   │   │       ├── payrollService.ts
│   │   │       └── payrollEngine.ts  # computeNetSalary, validateSalaryComponents
│   │   ├── scripts/
│   │   │   └── seedHrData.ts
│   │   └── index.ts                  # Server entry point (port 1000)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/                 # PrivateRoute
    │   │   ├── HR/                   # EmployeeList, EmployeeForm, OrganisationChart
    │   │   └── common/               # Button, Card, Input
    │   ├── config/
    │   │   └── env.ts                # API_URL export (reads VITE_API_URL)
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── SidebarContext.tsx
    │   ├── layout/
    │   │   ├── Mainlayout.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── ProfileDrawer.tsx
    │   ├── pages/
    │   │   ├── HR/                   # Employees, Attendance, Leave, Payroll
    │   │   ├── Dashboard.tsx
    │   │   ├── Finance.tsx
    │   │   ├── SupplyChain.tsx
    │   │   ├── Projects.tsx
    │   │   ├── Reports.tsx
    │   │   ├── Notifications.tsx
    │   │   ├── Settings.tsx
    │   │   ├── Profile.tsx
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── services/
    │   │   ├── api.ts                # Axios instance with Bearer token interceptor
    │   │   ├── authService.ts
    │   │   ├── hrService.ts
    │   │   └── notificationService.ts
    │   ├── types/                    # TypeScript interfaces for all models
    │   └── App.tsx                   # Route declarations
    ├── .env
    ├── .env.example
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
```

---

## Installation

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local instance or MongoDB Atlas)
- npm 10+

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd erp-ai-cloud-project

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=1000
MONGO_URI=mongodb://localhost:27017/erp-cloud
JWT_SECRET=your_super_secret_jwt_key
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `1000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret used to sign JWT tokens | — |

### Frontend — `frontend/.env`

```env
VITE_API_URL=/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API calls. Use `/api` with the Vite dev proxy, or the full backend URL for production. |

See `frontend/.env.example` for reference.

---

## Running the Application

### Development

Run both servers in separate terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev
# Server starts on http://localhost:1000

# Terminal 2 — frontend
cd frontend
npm run dev
# Dev server starts on http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:1000`, so no CORS configuration is needed in development.

### Production

```bash
# Build the frontend
cd frontend
npm run build
# Output written to frontend/dist/

# Start the backend
cd backend
npm start
# Requires compiled JS — run npx tsc first if needed
```

Serve the `frontend/dist` folder with your static hosting provider or a reverse proxy (e.g. Nginx), and set `VITE_API_URL` to your production backend URL at build time.

---

## Build Commands

### Frontend

```bash
cd frontend

npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript check + production build → dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### Backend

```bash
cd backend

npm run dev       # Run with ts-node (no watch)
npm start         # Run compiled JS (production)
npm run seed:hr   # Seed HR demo data
```

---

## Development Workflow

1. Create a feature branch from `main`.
2. Start both dev servers (see [Running the Application](#running-the-application)).
3. Make changes. The frontend hot-reloads; the backend requires a restart.
4. Verify the build is clean before opening a PR:

   ```bash
   cd frontend && npm run build
   cd ../backend && npx tsc --noEmit
   ```

5. Open a pull request against `main`.

---

## API Overview

All endpoints require an `Authorization: Bearer <token>` header unless marked Public.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (defaults to `employee` role) |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/auth/profile` | Any | Get current user profile |
| `PUT` | `/api/auth/change-password` | Any | Change password |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | admin | List all users |
| `POST` | `/api/users` | admin | Create user |
| `PUT` | `/api/users/:id` | admin | Update user (including role) |
| `DELETE` | `/api/users/:id` | admin | Delete user |
| `PUT` | `/api/users/me` | Any | Update own display name |

### Human Resources

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/hr/employees` | Any | List all employees |
| `POST` | `/api/hr/employees` | admin | Create employee |
| `PUT` | `/api/hr/employees/:id` | admin | Update employee |
| `DELETE` | `/api/hr/employees/:id` | admin | Delete employee |
| `GET` | `/api/hr/employees/:id` | Any | Get employee by ID |
| `GET` | `/api/hr/search` | Any | Search employees |
| `GET` | `/api/hr/organisation` | Any | Seniority-sorted org chart grouped by department |
| `GET` | `/api/hr/attendance` | Any | List attendance records |
| `POST` | `/api/hr/attendance` | hr, admin | Log attendance record |
| `PUT` | `/api/hr/attendance/:id` | hr, admin | Update attendance record |
| `GET` | `/api/hr/leave` | Any | List leave requests |
| `POST` | `/api/hr/leave` | Any | Submit leave request |
| `PUT` | `/api/hr/leave/:id/status` | hr, manager, admin | Approve or reject leave |
| `GET` | `/api/hr/payroll` | hr, finance, admin | List payroll records |
| `POST` | `/api/hr/payroll` | hr, admin | Create payroll record |
| `PUT` | `/api/hr/payroll/:id` | hr, admin | Update payroll record |
| `DELETE` | `/api/hr/payroll/:id` | admin | Delete payroll record |
| `GET` | `/api/hr/payslips` | hr, finance, admin | List all payslips |
| `POST` | `/api/hr/payslips` | hr, admin | Generate payslip |
| `DELETE` | `/api/hr/payslips/:id` | admin | Delete payslip |
| `GET` | `/api/hr/payslips/employee/:employeeId` | Any | Get payslips for one employee |

### Finance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/finance/transactions` | finance, admin | List transactions |
| `POST` | `/api/finance/transactions` | finance, admin | Create transaction |
| `PUT` | `/api/finance/transactions/:id` | finance, admin | Update transaction |
| `DELETE` | `/api/finance/transactions/:id` | admin | Delete transaction |

### Supply Chain

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/supply-chain/inventory` | Any | List inventory items |
| `POST` | `/api/supply-chain/inventory` | admin, manager | Add inventory item |
| `PUT` | `/api/supply-chain/inventory/:id` | admin, manager | Update inventory item |
| `DELETE` | `/api/supply-chain/inventory/:id` | admin | Delete inventory item |
| `GET` | `/api/supply-chain/purchase-orders` | Any | List purchase orders |
| `POST` | `/api/supply-chain/purchase-orders` | admin, manager | Create purchase order |
| `PUT` | `/api/supply-chain/purchase-orders/:id` | admin, manager | Update purchase order |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Any | List projects |
| `POST` | `/api/projects` | admin, manager | Create project |
| `PUT` | `/api/projects/:id` | admin, manager | Update project |
| `DELETE` | `/api/projects/:id` | admin | Delete project |

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Any | List notifications |
| `POST` | `/api/notifications` | Any | Create notification |
| `PUT` | `/api/notifications/:id/read` | Any | Mark notification as read |

### Settings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/settings` | Any | Get tenant settings |
| `PUT` | `/api/settings` | admin | Update tenant settings |

### Reports and Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reports/summary` | Any | Aggregate summary across all modules |
| `GET` | `/api/audit-logs` | admin | Paginated audit log with filters |
| `GET` | `/api/dashboard/config` | Any | Get current user's dashboard layout |
| `POST` | `/api/dashboard/config` | Any | Save current user's dashboard layout |

---

## Authentication Flow

```
1. User submits credentials to POST /api/auth/login
2. Server verifies email and compares bcrypt hash
3. On success, server signs a JWT (7-day expiry) with { userId, role }
4. Client stores the JWT in localStorage
5. All subsequent requests include:
      Authorization: Bearer <token>
6. Backend protect middleware verifies the token on every protected route
7. Backend authorize middleware checks role against the route's required roles
8. On logout, the token is removed from localStorage and AuthContext is cleared
```

New users always register with the `employee` role. Only an admin can update a user's role via `PUT /api/users/:id`.

### Role Permissions Summary

| Resource | admin | hr | manager | finance | employee |
|---|---|---|---|---|---|
| Employees | Full CRUD | Read | Read | — | — |
| Attendance | Full CRUD | Read/Write | Read | — | — |
| Leave | Read/Approve | Read/Approve | Read/Approve | — | Submit |
| Payroll | Full CRUD | Read/Write | — | Read | — |
| Payslips | Full CRUD | Read/Write | — | Read | Read own |
| Finance | Full CRUD | — | — | Read/Write | — |
| Supply Chain | Full CRUD | — | Read/Write | — | — |
| Projects | Full CRUD | — | Read/Write | — | — |
| Settings | Read/Write | Read | Read | Read | Read |
| Users | Full CRUD | — | — | — | — |
| Audit Logs | Read | — | — | — | — |

---

## Seed Data

Populate the database with realistic HR demo data:

```bash
cd backend
npm run seed:hr
```

This script inserts the following records:

| Collection | Records |
|---|---|
| Employees | 6 |
| Attendance | ~10 |
| Leave Requests | 6 |
| Payroll | 6 |

**Employees seeded:**

| ID | Name | Department | Designation |
|---|---|---|---|
| 2024001 | Rajesh Kumar | HR | HR Manager |
| 2024002 | Priya Sharma | HR | Recruiter |
| 2024003 | Arjun Reddy | Engineering | Software Engineer |
| 2024004 | Sneha Patel | Finance | Accountant |
| 2024005 | Vikram Singh | Operations | Project Manager |
| 2024006 | Neha Gupta | Analytics | Data Analyst |

---

## Screenshots

> _Screenshots to be added after deployment._

| Page | Description |
|---|---|
| Dashboard | Drag-and-drop widget grid with KPI cards and low-stock alerts |
| HR — Employees | Employee table with edit/delete and Organisation Chart below |
| HR — Employee Detail | Profile card, attendance summary, leave history |
| Finance | GL/AP/AR/Payment transaction table with status pills |
| Supply Chain | Inventory table and purchase orders |
| Projects | Project portfolio with progress bars and status badges |
| Reports | BI summary, Audit Trail, and Metrics tabs |
| Notifications | Alert table with channel and severity badges |
| Settings | Tenant configuration form |
| Profile Drawer | Slide-out profile panel with inline name editing |

---

## Future Improvements

- **Code splitting** — the current bundle is ~823 KB uncompressed; route-based lazy loading would reduce initial load time
- **Real delivery channels** — wire the Email, SMS, and Webhook notification channels to actual delivery providers
- **MFA enforcement** — the `mfaRequired` setting exists in the schema but TOTP verification is not yet implemented
- **Payslip PDF export** — generate downloadable PDF payslips from the payroll engine output
- **Refresh token rotation** — replace the 7-day static JWT with short-lived access tokens and a refresh token strategy
- **Test coverage** — no automated tests exist; unit tests for the payroll engine and integration tests for the auth flow are the highest-value starting points
- **Docker Compose** — containerise the backend and MongoDB for one-command local setup
- **Advanced RBAC** — field-level or resource-level permissions beyond the current role categories


