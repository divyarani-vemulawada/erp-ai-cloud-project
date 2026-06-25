# ERP AI Cloud Project

A full-stack Enterprise Resource Planning (ERP) web application built with React, Node.js, Express, TypeScript, and MongoDB. The system provides modular HR management with JWT-based authentication and role-based access control.

---

## Features

- **User Authentication** — Register and login with hashed passwords
- **JWT Authorization** — Stateless token-based session management
- **Role-Based Access Control** — Admin, HR, Manager, Finance, and Employee roles
- **Protected Routes** — Frontend route guards and backend middleware
- **Employee Management** — Full CRUD: create, view, edit, and delete employee records
- **Attendance Management** — Daily attendance tracking with check-in/check-out support
- **Leave Management** — Submit leave requests; approve or reject with status tracking
- **Payroll Management** — Manage salary records with allowances and deductions
- **MongoDB Integration** — Persistent data storage via Mongoose ODM
- **Seed Data Support** — One-command demo data seeding with force-reseed option

---

## Tech Stack

### Frontend

| Technology | Version |
|---|---|
| React | 19 |
| TypeScript | 5+ |
| Vite | 8 |
| React Router | v7 |
| Axios | Latest |

### Backend

| Technology | Version |
|---|---|
| Node.js | 18+ |
| Express | 5 |
| TypeScript | 6 |
| MongoDB | Atlas (cloud) |
| Mongoose | 9.7 |
| JSON Web Token | 9 |
| bcryptjs | 3 |

---

## Project Structure

```
erp-ai-cloud-project/
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Request handlers (auth, HR)
│       ├── middleware/       # JWT auth, role authorization
│       ├── models/          # Mongoose schemas (User, Employee, Attendance, LeaveRequest, Payroll)
│       ├── routes/          # Express route definitions
│       ├── scripts/         # Seed scripts
│       └── services/        # Business logic layer
└── frontend/
    └── src/
        ├── components/      # Reusable UI components (common + HR module)
        ├── layout/          # MainLayout, sidebar, navbar
        ├── pages/           # Auth and HR pages
        ├── services/        # Axios API clients (authService, hrService)
        └── types/           # Shared TypeScript interfaces
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=1000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

---

## Installation & Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

The API server starts on `http://localhost:1000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`.

---

## Seed Commands

Populate the database with realistic demo data for local development and testing.

**Normal mode** — inserts data only into empty collections:

```bash
cd backend
npm run seed:hr
```

**Force mode** — clears all HR collections and reinserts the full dataset:

```bash
cd backend
npm run seed:hr -- --force
```

### Sample Data

| Collection | Records |
|---|---|
| Employees | 6 |
| Attendance | 10 |
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

## API Endpoints

All HR routes require a valid JWT token (`Authorization: Bearer <token>`).

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |

### Employees

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/hr/employees` | List all employees | admin, hr, manager |
| POST | `/api/hr/employees` | Create an employee | admin, hr |
| GET | `/api/hr/employees/:id` | Get employee by ID | admin, hr, manager |
| PUT | `/api/hr/employees/:id` | Update employee | admin, hr |
| DELETE | `/api/hr/employees/:id` | Delete employee | admin |

### Attendance

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/hr/attendance` | List all attendance records | admin, hr, manager |
| POST | `/api/hr/attendance` | Create attendance record | admin, hr |
| PUT | `/api/hr/attendance/:id` | Update check-in/check-out/status | admin, hr |

### Leave Requests

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/hr/leave` | List all leave requests | admin, hr, manager |
| POST | `/api/hr/leave` | Submit a leave request | admin, hr, manager, employee |
| PUT | `/api/hr/leave/:id/status` | Approve or reject request | admin, hr |

### Payroll

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/hr/payroll` | List all payroll records | admin, hr, finance |
| POST | `/api/hr/payroll` | Create payroll record | admin, hr |
| PUT | `/api/hr/payroll/:id` | Update payroll record | admin, hr |
| DELETE | `/api/hr/payroll/:id` | Delete payroll record | admin |

---

## Role Permissions Summary

| Role | Employees | Attendance | Leave | Payroll |
|---|---|---|---|---|
| admin | Full CRUD | Read, Write | Read, Approve/Reject | Full CRUD |
| hr | Read, Write | Read, Write | Read, Approve/Reject | Read, Write |
| manager | Read | Read | Read | — |
| finance | — | — | — | Read |
| employee | — | — | Submit | — |

---

## Current Status

| Module | Status |
|---|---|
| User Authentication | Complete |
| JWT Middleware | Complete |
| Employee Management | Complete |
| Attendance Management | Complete |
| Leave Management | Complete |
| Payroll Management | Complete |
| Seed Script | Complete |
| Frontend Integration | Complete |

The HR module is fully implemented and integrated with MongoDB. All four HR pages (Employees, Attendance, Leave, Payroll) are connected to the backend API with live data persistence.
