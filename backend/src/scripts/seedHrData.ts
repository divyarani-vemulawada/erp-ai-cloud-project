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

// ── Seed data ───────────────────────────────────────────────────────────────

const employeeData = [
  { employeeId: "2024001", fullName: "Rajesh Kumar", email: "rajesh.kumar@company.com", phone: "9876543210", department: "HR", designation: "HR Manager", joiningDate: "2020-03-15", status: "Active" },
  { employeeId: "2024002", fullName: "Priya Sharma", email: "priya.sharma@company.com", phone: "9876543211", department: "HR", designation: "Recruiter", joiningDate: "2021-06-01", status: "Active" },
  { employeeId: "2024003", fullName: "Arjun Reddy", email: "arjun.reddy@company.com", phone: "9876543212", department: "Engineering", designation: "Software Engineer", joiningDate: "2022-01-10", status: "Active" },
  { employeeId: "2024004", fullName: "Sneha Patel", email: "sneha.patel@company.com", phone: "9876543213", department: "Finance", designation: "Accountant", joiningDate: "2021-09-20", status: "Active" },
  { employeeId: "2024005", fullName: "Vikram Singh", email: "vikram.singh@company.com", phone: "9876543214", department: "Operations", designation: "Project Manager", joiningDate: "2019-11-05", status: "Active" },
  { employeeId: "2024006", fullName: "Neha Gupta", email: "neha.gupta@company.com", phone: "9876543215", department: "Analytics", designation: "Data Analyst", joiningDate: "2023-02-14", status: "Active" },
  { employeeId: "2024007", fullName: "Amit Verma", email: "amit.verma@company.com", phone: "9876543216", department: "Engineering", designation: "Senior Developer", joiningDate: "2022-04-12", status: "Active" },
  { employeeId: "2024008", fullName: "Rohan Das", email: "rohan.das@company.com", phone: "9876543217", department: "Sales", designation: "Sales Executive", joiningDate: "2023-01-15", status: "Active" },
  { employeeId: "2024009", fullName: "Meera Nair", email: "meera.nair@company.com", phone: "9876543218", department: "Marketing", designation: "SEO Lead", joiningDate: "2021-11-10", status: "Active" },
  { employeeId: "2024010", fullName: "Kunal Sen", email: "kunal.sen@company.com", phone: "9876543219", department: "Support", designation: "Technical Support", joiningDate: "2023-08-01", status: "Active" },
  { employeeId: "2024011", fullName: "Ananya Rao", email: "ananya.rao@company.com", phone: "9876543220", department: "Product", designation: "Product Owner", joiningDate: "2020-05-18", status: "Active" },
  { employeeId: "2024012", fullName: "Sanjay Dutt", email: "sanjay.dutt@company.com", phone: "9876543221", department: "QA", designation: "QA Engineer", joiningDate: "2022-09-01", status: "Active" },
  { employeeId: "2024013", fullName: "Kriti Sanon", email: "kriti.sanon@company.com", phone: "9876543222", department: "Legal", designation: "Legal Counsel", joiningDate: "2021-02-14", status: "Active" },
  { employeeId: "2024014", fullName: "Varun Dhawan", email: "varun.dhawan@company.com", phone: "9876543223", department: "Engineering", designation: "DevOps Engineer", joiningDate: "2023-03-20", status: "Active" },
  { employeeId: "2024015", fullName: "Alia Bhatt", email: "alia.bhatt@company.com", phone: "9876543224", department: "Marketing", designation: "Content Strategist", joiningDate: "2022-10-05", status: "Active" },
  { employeeId: "2024016", fullName: "Sid Malhotra", email: "sid.malhotra@company.com", phone: "9876543225", department: "Finance", designation: "Financial Analyst", joiningDate: "2023-05-10", status: "Active" },
];

const attendanceData = [
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
  { employeeId: "2024007", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024008", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024009", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024010", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024011", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024012", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024013", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024014", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024015", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
  { employeeId: "2024016", date: "2024-12-02", checkIn: "09:00", checkOut: "18:00", status: "Present" },
];

const leaveData = [
  { employeeId: "2024001", leaveType: "Annual", startDate: "2024-11-20", endDate: "2024-11-22", reason: "Family vacation", status: "Approved" },
  { employeeId: "2024002", leaveType: "Sick", startDate: "2024-11-28", endDate: "2024-11-29", reason: "Fever and cold", status: "Approved" },
  { employeeId: "2024003", leaveType: "Personal", startDate: "2024-12-05", endDate: "2024-12-06", reason: "Personal work", status: "Pending" },
  { employeeId: "2024004", leaveType: "Annual", startDate: "2024-12-10", endDate: "2024-12-12", reason: "Year-end leave", status: "Pending" },
  { employeeId: "2024005", leaveType: "Paternity", startDate: "2024-12-15", endDate: "2024-12-20", reason: "Paternity leave", status: "Rejected" },
  { employeeId: "2024006", leaveType: "Sick", startDate: "2024-12-01", endDate: "2024-12-01", reason: "Medical checkup", status: "Pending" },
];

const payrollData = [
  { employeeId: "2024001", basicSalary: 85000,  allowances: 15000, deductions: 8500,  netSalary: 91500  },
  { employeeId: "2024002", basicSalary: 65000,  allowances: 10000, deductions: 6500,  netSalary: 68500  },
  { employeeId: "2024003", basicSalary: 95000,  allowances: 20000, deductions: 9500,  netSalary: 105500 },
  { employeeId: "2024004", basicSalary: 72000,  allowances: 12000, deductions: 7200,  netSalary: 76800  },
  { employeeId: "2024005", basicSalary: 110000, allowances: 25000, deductions: 11000, netSalary: 124000 },
  { employeeId: "2024006", basicSalary: 80000,  allowances: 15000, deductions: 8000,  netSalary: 87000  },
  { employeeId: "2024007", basicSalary: 100000, allowances: 20000, deductions: 10000, netSalary: 110000 },
  { employeeId: "2024008", basicSalary: 55000,  allowances: 8000,  deductions: 5500,  netSalary: 57500  },
  { employeeId: "2024009", basicSalary: 75000,  allowances: 12000, deductions: 7500,  netSalary: 79500  },
  { employeeId: "2024010", basicSalary: 50000,  allowances: 7000,  deductions: 5000,  netSalary: 52000  },
  { employeeId: "2024011", basicSalary: 105000, allowances: 22000, deductions: 10500, netSalary: 116500 },
  { employeeId: "2024012", basicSalary: 70000,  allowances: 10000, deductions: 7000,  netSalary: 73000  },
  { employeeId: "2024013", basicSalary: 90000,  allowances: 15000, deductions: 9000,  netSalary: 96000  },
  { employeeId: "2024014", basicSalary: 85000,  allowances: 15000, deductions: 8500,  netSalary: 91500  },
  { employeeId: "2024015", basicSalary: 78000,  allowances: 12000, deductions: 7800,  netSalary: 82200  },
  { employeeId: "2024016", basicSalary: 82000,  allowances: 14000, deductions: 8200,  netSalary: 87800  },
];

// ── Types ───────────────────────────────────────────────────────────────────

interface CollectionResult {
  label: string;
  deleted: number;
  inserted: number;
  total: number;
}

// ── Core helper ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCollection(
  label: string,
  model: mongoose.Model<any>,
  data: object[],
  force: boolean
): Promise<CollectionResult> {
  let deleted = 0;

  if (force) {
    const result = await model.deleteMany({});
    deleted = result.deletedCount ?? 0;
    const msg = deleted > 0 ? `deleted ${deleted}` : "was already empty";
    console.log(`  [del]  ${label}: ${msg}`);
    await model.insertMany(data);
    console.log(`  [ins]  ${label}: inserted ${data.length}`);
    return { label, deleted, inserted: data.length, total: data.length };
  }

  const existing = await model.countDocuments();
  if (existing > 0) {
    console.log(`  [skip] ${label}: ${existing} record(s) already exist`);
    return { label, deleted: 0, inserted: 0, total: existing };
  }

  await model.insertMany(data);
  console.log(`  [ins]  ${label}: inserted ${data.length}`);
  return { label, deleted: 0, inserted: data.length, total: data.length };
}

// ── Summary printer ─────────────────────────────────────────────────────────

function printSummary(results: CollectionResult[]) {
  const totalDeleted  = results.reduce((s, r) => s + r.deleted,  0);
  const totalInserted = results.reduce((s, r) => s + r.inserted, 0);
  const totalDocs     = results.reduce((s, r) => s + r.total,    0);

  const COL = { label: 18, deleted: 9, inserted: 10, total: 6 };
  const pad  = (v: string | number, n: number) => String(v).padEnd(n);
  const sep  = "-".repeat(COL.label + COL.deleted + COL.inserted + COL.total + 3);

  console.log("\n" + sep);
  console.log(
    pad("Collection", COL.label) +
    pad("Deleted",  COL.deleted) +
    pad("Inserted", COL.inserted) +
    "In DB"
  );
  console.log(sep);
  for (const r of results) {
    console.log(
      pad(r.label,    COL.label) +
      pad(r.deleted,  COL.deleted) +
      pad(r.inserted, COL.inserted) +
      r.total
    );
  }
  console.log(sep);
  console.log(
    pad("TOTAL",        COL.label) +
    pad(totalDeleted,  COL.deleted) +
    pad(totalInserted, COL.inserted) +
    totalDocs
  );
  console.log(sep + "\n");
}

// ── Entry point ─────────────────────────────────────────────────────────────

async function seed() {
  const force = process.argv.includes("--force");

  console.log("\nConnecting to MongoDB...");
  await connectDB();

  console.log(`\nMode: ${force ? "FORCE  -- all HR collections will be cleared and reseeded" : "NORMAL -- skip collections that already have data"}`);
  console.log("");

  const results: CollectionResult[] = [
    await handleCollection("Employees",      Employee,     employeeData,   force),
    await handleCollection("Attendance",     Attendance,   attendanceData, force),
    await handleCollection("Leave Requests", LeaveRequest, leaveData,      force),
    await handleCollection("Payroll",        Payroll,      payrollData,    force),
  ];

  printSummary(results);

  await mongoose.disconnect();
  console.log("Database disconnected. Done.\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
