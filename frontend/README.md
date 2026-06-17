# ERP AI Cloud Project

A modular Enterprise Resource Planning (ERP) system built with React and TypeScript. The application is structured for incremental delivery across HR, Finance, Supply Chain, and reporting modules, with a shared component library and role-based access patterns throughout.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Human Resources Module (Completed)](#human-resources-module-completed)
- [Current Development Status](#current-development-status)
- [Advanced ESLint Configuration](#advanced-eslint-configuration)

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI rendering |
| TypeScript | 6 | Static typing |
| Vite | 8 | Build tool and dev server |
| React Router | v7 | Client-side routing |
| React Icons | v5 | Icon library |
| ESLint | 10 | Linting with TypeScript rules |
| Node.js | ≥18 | Runtime environment |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Install and run

```bash
git clone https://github.com/divyarani-vemulawada/erp-ai-cloud-project.git
cd erp-ai-cloud-project/frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement enabled.

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check then bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |

### Production build

```bash
npm run build
```

Output is written to `dist/`.

---

## Project Structure

```
frontend/src/
├── components/
│   ├── common/        # Shared UI: Button, Card, Table, Input, Modal
│   └── HR/            # HR feature components
├── layout/            # App shell: MainLayout, Sidebar, Navbar
├── pages/
│   └── HR/            # Employees, Attendance, Leave, Payroll
├── services/
│   └── mock/          # Module mock data
├── store/             # Redux slice stubs (scaffolded for future use)
├── types/             # TypeScript interfaces per module
└── App.tsx            # Route definitions
```

### Authentication & User Access

Base structure is in place. A `currentUserRole` constant drives UI-level access control — admin users see Add, Edit, and Delete actions; non-admin users see read-only views. Full auth flow (login page, session management, protected routes) is scoped to an upcoming sprint.

### Human Resources

Fully implemented. Covers the complete employee lifecycle: directory management, attendance records, leave requests, payroll display, and a department organisation chart. See the [Human Resources Module](#human-resources-module-completed) section for details.

### Supply Chain

Module placeholder scaffolded. Redux slice stub exists. Pages and components are ready to be implemented.

### Finance

Module placeholder scaffolded. Redux slice stub exists. Implementation is in progress.

### Dashboard & Reports

Stub page exists in routing. Planned to aggregate data across all modules once individual module implementations are complete.

### Layout, Settings & Notifications

`MainLayout`, `Sidebar`, and `Navbar` are fully operational. The Sidebar supports collapsible section groups with expand/collapse toggle and arrow indicators. Settings and Notifications pages are planned.

---

## Human Resources Module (Completed)

The HR module is the first fully implemented ERP module.

### Pages

| Page | Route | Description |
|---|---|---|
| Employees | `/employees` | Employee directory with CRUD operations |
| Attendance | `/attendance` | Daily attendance records |
| Leave | `/leave` | Leave request tracking |
| Payroll | `/payroll` | Salary and payroll records |

### Components

| Component | Purpose |
|---|---|
| `EmployeeList` | Table of all employees; renders Edit and Delete buttons for admin users |
| `EmployeeForm` | Dual-mode form for creating and editing employees with error state |
| `AttendanceTracker` | Attendance records table with check-in, check-out, and status |
| `LeaveManagement` | Leave requests table with type, date range, reason, and approval status |
| `PayrollDashboard` | Payroll table with formatted salary breakdown per employee |
| `OrganisationChart` | Department-grouped employee hierarchy using Card components |

### Features

- **Employee CRUD** — Add new employees via form; edit existing records in-place; delete with confirmation dialog
- **Attendance tracking** — View check-in/check-out times and present/absent status per employee
- **Leave management** — View leave type, date range, reason, and approval status for all requests
- **Payroll dashboard** — Basic salary, allowances, deductions, and net salary displayed per employee
- **Organisation chart** — Employees grouped by department, each showing name and designation
- **Role-based HR actions** — Add, Edit, and Delete controls are visible only to admin (`currentUserRole = 'admin'`)
- **Sidebar integration** — Human Resources section is collapsible with ▶/▼ toggle; sub-links for all four HR routes
- **React Router integration** — All HR pages registered and reachable; `/hr` redirects to `/employees`
- **Mock data integration** — 10 employees, 10 attendance records, 5 leave requests, 10 payroll records served from `src/services/mock/hrMockData.ts`

### Type definitions (`src/types/hr.ts`)

```ts
Employee      — id, employeeId, fullName, email, phone, department, designation, joiningDate, status
LeaveRequest  — id, employeeId, leaveType, startDate, endDate, reason, status
Attendance    — id, employeeId, date, checkIn, checkOut, status
Payroll       — id, employeeId, basicSalary, allowances, deductions, netSalary
```

---

## Current Development Status

### Completed

- [x] React + TypeScript + Vite project scaffolding
- [x] App shell — MainLayout, collapsible Sidebar, Navbar
- [x] Common component library — Button (with variants), Card (with children), Table, Input, Modal
- [x] HR module — all pages, components, routing, and features
- [x] Role-based UI with mock admin access control
- [x] Client-side routing — `/`, `/employees`, `/attendance`, `/leave`, `/payroll`
- [x] TypeScript — zero type errors
- [x] Production build — passes clean

### In Progress

- [ ] Authentication — login page, session handling, protected routes
- [ ] Supply Chain Module
- [ ] Finance Module
- [ ] Dashboard & Reports

### Upcoming

- [ ] API integration — replace mock data with live backend
- [ ] State management — activate Redux slices (stubs already scaffolded)
- [ ] Integration testing — cross-module data consistency
- [ ] End-to-end testing — full user journey coverage

---

## Advanced ESLint Configuration

For production applications, enable type-aware lint rules by updating `eslint.config.js`:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or tseslint.configs.strictTypeChecked for stricter enforcement
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also add React-specific lint rules:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

Install the additional plugins if needed:

```bash
npm install -D eslint-plugin-react-x eslint-plugin-react-dom
```

---

*ERP AI Cloud Project — modular enterprise management, built incrementally.*
