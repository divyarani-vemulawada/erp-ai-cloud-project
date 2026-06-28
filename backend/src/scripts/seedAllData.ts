import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";
import connectDB from "../config/database";

import Employee from "../models/hr/Employee";
import Attendance from "../models/hr/Attendance";
import LeaveRequest from "../models/hr/Leave";
import Payroll from "../models/hr/Payroll";
import Payslip from "../models/hr/Payslip";
import FinanceTransaction from "../models/FinanceTransaction";
import InventoryItem from "../models/InventoryItem";
import PurchaseOrder from "../models/PurchaseOrder";
import Project from "../models/Project";
import Notification from "../models/Notification";

const employees = [
  { employeeId: "2024001", fullName: "Rajesh Kumar", email: "rajesh.kumar@company.com", phone: "9876543210", department: "HR", designation: "HR Manager", joiningDate: "2020-03-15", status: "Active" },
  { employeeId: "2024002", fullName: "Priya Sharma", email: "priya.sharma@company.com", phone: "9876543211", department: "HR", designation: "Recruiter", joiningDate: "2021-06-01", status: "Active" },
  { employeeId: "2024003", fullName: "Arjun Reddy", email: "arjun.reddy@company.com", phone: "9876543212", department: "Engineering", designation: "Software Engineer", joiningDate: "2022-01-10", status: "Active" },
  { employeeId: "2024004", fullName: "Sneha Patel", email: "sneha.patel@company.com", phone: "9876543213", department: "Finance", designation: "Accountant", joiningDate: "2021-09-20", status: "Active" },
  { employeeId: "2024005", fullName: "Vikram Singh", email: "vikram.singh@company.com", phone: "9876543214", department: "Operations", designation: "Project Manager", joiningDate: "2019-11-05", status: "Active" },
  { employeeId: "2024006", fullName: "Neha Gupta", email: "neha.gupta@company.com", phone: "9876543215", department: "Analytics", designation: "Data Analyst", joiningDate: "2023-02-14", status: "Active" },
];

const attendance = [
  { employeeId: "2024001", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024001", date: "2024-12-03", checkIn: "09:15", checkOut: "17:45", status: "Present" },
  { employeeId: "2024002", date: "2024-12-02", checkIn: "09:30", checkOut: "18:30", status: "Present" },
  { employeeId: "2024002", date: "2024-12-03", checkIn: "",       checkOut: "",       status: "Absent"  },
  { employeeId: "2024003", date: "2024-12-02", checkIn: "",       checkOut: "",       status: "Absent"  },
  { employeeId: "2024003", date: "2024-12-03", checkIn: "10:00", checkOut: "19:00", status: "Present" },
  { employeeId: "2024004", date: "2024-12-02", checkIn: "08:45", checkOut: "17:30", status: "Present" },
  { employeeId: "2024004", date: "2024-12-03", checkIn: "08:50", checkOut: "17:45", status: "Present" },
  { employeeId: "2024005", date: "2024-12-03", checkIn: "",       checkOut: "",       status: "Absent"  },
  { employeeId: "2024006", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
];

const leaves = [
  { employeeId: "2024001", leaveType: "Annual", startDate: "2024-11-20", endDate: "2024-11-22", reason: "Family vacation", status: "Approved" },
  { employeeId: "2024002", leaveType: "Sick", startDate: "2024-11-28", endDate: "2024-11-29", reason: "Fever and cold", status: "Approved" },
  { employeeId: "2024003", leaveType: "Personal", startDate: "2024-12-05", endDate: "2024-12-06", reason: "Personal work", status: "Pending" },
  { employeeId: "2024004", leaveType: "Annual", startDate: "2024-12-10", endDate: "2024-12-12", reason: "Year-end leave", status: "Pending" },
  { employeeId: "2024005", leaveType: "Paternity", startDate: "2024-12-15", endDate: "2024-12-20", reason: "Paternity leave", status: "Rejected" },
  { employeeId: "2024006", leaveType: "Sick", startDate: "2024-12-01", endDate: "2024-12-01", reason: "Medical checkup", status: "Pending" },
];

const payrolls = [
  { employeeId: "2024001", basicSalary: 85000,  allowances: 15000, deductions: 8500,  netSalary: 91500  },
  { employeeId: "2024002", basicSalary: 65000,  allowances: 10000, deductions: 6500,  netSalary: 68500  },
  { employeeId: "2024003", basicSalary: 95000,  allowances: 20000, deductions: 9500,  netSalary: 105500 },
  { employeeId: "2024004", basicSalary: 72000,  allowances: 12000, deductions: 7200,  netSalary: 76800  },
  { employeeId: "2024005", basicSalary: 110000, allowances: 25000, deductions: 11000, netSalary: 124000 },
  { employeeId: "2024006", basicSalary: 80000,  allowances: 15000, deductions: 8000,  netSalary: 87000  },
];

const financeTransactions = [
  { reference: "TXN-2026-001", type: "GL", account: "Retained Earnings", counterparty: "Internal Transfer", currency: "INR", amount: 1500000, status: "Approved", transactionDate: "2026-06-01", description: "Beginning balance consolidation" },
  { reference: "TXN-2026-002", type: "AP", account: "Accounts Payable", counterparty: "Intel Corp (Vendor)", currency: "INR", amount: 350000, status: "Approved", transactionDate: "2026-06-10", description: "Microprocessor bulk purchase" },
  { reference: "TXN-2026-003", type: "AR", account: "Accounts Receivable", counterparty: "Reliance Industries (Client)", currency: "INR", amount: 850000, status: "Approved", transactionDate: "2026-06-15", description: "Phase 1 analytics portal milestone" },
  { reference: "TXN-2026-004", type: "Payment", account: "HDFC Bank Operating Acc", counterparty: "Employees Payroll", currency: "INR", amount: 553300, status: "Paid", transactionDate: "2026-06-25", description: "June 2026 net salary disbursement" },
  { reference: "TXN-2026-005", type: "AP", account: "Accounts Payable", counterparty: "Tata Steel (Vendor)", currency: "INR", amount: 180000, status: "Pending", transactionDate: "2026-06-27", description: "Structural steel coils inventory replenishment" },
  { reference: "TXN-2026-006", type: "AR", account: "Accounts Receivable", counterparty: "Adani Enterprises (Client)", currency: "INR", amount: 420000, status: "Draft", transactionDate: "2026-06-28", description: "Supply chain consulting retainer" },
];

const inventoryItems = [
  { sku: "SKU-001", name: "Intel Core i7 Processor", category: "Microchips", warehouse: "Bangalore Main WH", stock: 120, reorderLevel: 50, unitCost: 28000, vendor: "Intel Corp", status: "In Stock" },
  { sku: "SKU-002", name: "Structural Steel Coils (10t)", category: "Raw Steel", warehouse: "Mumbai Port WH", stock: 15, reorderLevel: 20, unitCost: 85000, vendor: "Tata Steel", status: "Low Stock" },
  { sku: "SKU-003", name: "Precision Industrial Screws (1000x)", category: "Hardware Fasteners", warehouse: "Pune Assembly WH", stock: 4500, reorderLevel: 1000, unitCost: 1500, vendor: "Fastener Source Inc", status: "In Stock" },
  { sku: "SKU-004", name: "Lithium-Ion Battery Pack (48V)", category: "Power Systems", warehouse: "Bangalore Main WH", stock: 8, reorderLevel: 15, unitCost: 45000, vendor: "Exide Technologies", status: "Low Stock" },
  { sku: "SKU-005", name: "Fiber Optic Transceivers (10G)", category: "Networking Components", warehouse: "Hyderabad R&D Lab", stock: 0, reorderLevel: 25, unitCost: 4200, vendor: "Cisco Systems", status: "Out of Stock" },
];

const purchaseOrders = [
  { poNumber: "PO-2026-001", vendor: "Tata Steel", item: "Structural Steel Coils (10t)", quantity: 15, expectedDate: "2026-07-05", amount: 1275000, status: "Sent" },
  { poNumber: "PO-2026-002", vendor: "Cisco Systems", item: "Fiber Optic Transceivers (10G)", quantity: 30, expectedDate: "2026-07-10", amount: 126000, status: "Draft" },
  { poNumber: "PO-2026-003", vendor: "Intel Corp", item: "Intel Core i7 Processor", quantity: 80, expectedDate: "2026-06-30", amount: 2240000, status: "Received" },
];

const projects = [
  { projectCode: "PRJ-CLOUD-MIG", name: "AWS Enterprise Cloud Migration", owner: "Vikram Singh", startDate: "2026-01-01", dueDate: "2026-08-30", budget: 4500000, actualSpend: 3200000, progress: 75, status: "Active" },
  { projectCode: "PRJ-AI-FORECAST", name: "SKU Demand Forecasting Integration", owner: "Neha Gupta", startDate: "2026-04-15", dueDate: "2026-07-15", budget: 1500000, actualSpend: 1350000, progress: 90, status: "At Risk" },
  { projectCode: "PRJ-LEDB-SYSTEM", name: "Double Entry Ledger Upgrade", owner: "Sneha Patel", startDate: "2026-05-01", dueDate: "2026-09-30", budget: 2000000, actualSpend: 250000, progress: 20, status: "Planning" },
  { projectCode: "PRJ-PWA-OFFLINE", name: "Offline Service Worker PWA Setup", owner: "Arjun Reddy", startDate: "2026-03-10", dueDate: "2026-06-15", budget: 800000, actualSpend: 810000, progress: 100, status: "Completed" },
];

const notifications = [
  { title: "Inventory Critical Alert", message: "Fiber Optic Transceivers are out of stock. Automatic PO Draft created.", type: "system", status: "Unread" },
  { title: "Ledger Transaction Pending", message: " tata steel AP transaction of 180,000 INR needs double-entry approval.", type: "finance", status: "Unread" },
  { title: "Project Delay Alert", message: "PRJ-AI-FORECAST project has been marked At Risk due to delay in PyTorch API integration.", type: "project", status: "Unread" },
  { title: "Payroll Configured", message: "June 2026 payroll run initialized successfully in background queue.", type: "system", status: "Read" },
];

const PAYSLIP_PERIODS = [
  { month: "November", year: 2025, status: "Issued" },
  { month: "December", year: 2025, status: "Issued" },
  { month: "January",  year: 2026, status: "Issued" },
  { month: "February", year: 2026, status: "Issued" },
  { month: "March",    year: 2026, status: "Issued" },
  { month: "April",    year: 2026, status: "Draft"  },
];

async function seedAll() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected successfully!");

  console.log("Clearing existing collections...");
  await Promise.all([
    Employee.deleteMany({}),
    Attendance.deleteMany({}),
    LeaveRequest.deleteMany({}),
    Payroll.deleteMany({}),
    Payslip.deleteMany({}),
    FinanceTransaction.deleteMany({}),
    InventoryItem.deleteMany({}),
    PurchaseOrder.deleteMany({}),
    Project.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("Collections cleared.");

  console.log("Inserting seed data...");

  // Phase 1: insert everything except payslips in parallel.
  // Capture the inserted payroll documents so their _ids can be used for payslips.
  const results = await Promise.all([
    Employee.insertMany(employees),
    Attendance.insertMany(attendance),
    LeaveRequest.insertMany(leaves),
    Payroll.insertMany(payrolls),           // index 3 — captured below
    FinanceTransaction.insertMany(financeTransactions),
    InventoryItem.insertMany(inventoryItems),
    PurchaseOrder.insertMany(purchaseOrders),
    Project.insertMany(projects),
    Notification.insertMany(notifications),
  ]);

  const insertedPayrolls = results[3];

  // Phase 2: generate one payslip per payroll record for each seeded period.
  // Each employee gets payslips for the same 6 months, derived from their payroll record.
  const payslipDocs = insertedPayrolls.flatMap((p: any, employeeIdx: number) =>
    PAYSLIP_PERIODS.map((period, periodIdx) => ({
      employeeId: p.employeeId,
      payrollId:  String(p._id),
      month:      period.month,
      year:       period.year,
      basicSalary: p.basicSalary,
      allowances:  p.allowances,
      deductions:  p.deductions,
      netSalary:   p.netSalary,
      generatedAt: new Date(period.year, periodIdx + 10, 25), // 25th of each month
      status:      period.status,
    }))
  );

  await Payslip.insertMany(payslipDocs);

  console.log(`Seeding complete! Inserted ${payslipDocs.length} payslips across ${insertedPayrolls.length} employees.`);
  await mongoose.disconnect();
  console.log("Disconnected. Database is now fully populated.");
}

seedAll().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
