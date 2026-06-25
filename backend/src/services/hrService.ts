import Employee from "../models/Employee";
import LeaveRequest from "../models/LeaveRequest";
import Attendance from "../models/Attendance";
import Payroll from "../models/Payroll";

// ── Employees ──────────────────────────────────────────────────────────────

export const getAllEmployees = async () => {
  return await Employee.find();
};

export const getEmployeeById = async (id: string) => {
  const employee = await Employee.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const createEmployee = async (data: {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status?: "Active" | "Inactive";
}) => {
  const existingId = await Employee.findOne({ employeeId: data.employeeId });
  if (existingId) throw new Error("Employee ID already exists");

  const existingEmail = await Employee.findOne({ email: data.email });
  if (existingEmail) throw new Error("Email already exists");

  return await Employee.create(data);
};

export const updateEmployee = async (
  id: string,
  data: Partial<{
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    joiningDate: string;
    status: "Active" | "Inactive";
  }>
) => {
  const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const deleteEmployee = async (id: string) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
};

// ── Leave Requests ─────────────────────────────────────────────────────────

export const getAllLeaveRequests = async () => {
  return await LeaveRequest.find();
};

export const getLeaveRequestById = async (id: string) => {
  const leave = await LeaveRequest.findById(id);
  if (!leave) throw new Error("Leave request not found");
  return leave;
};

export const createLeaveRequest = async (data: {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}) => {
  return await LeaveRequest.create(data);
};

export const updateLeaveStatus = async (
  id: string,
  status: "Pending" | "Approved" | "Rejected"
) => {
  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status value");

  const leave = await LeaveRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!leave) throw new Error("Leave request not found");
  return leave;
};

// ── Attendance ─────────────────────────────────────────────────────────────

export const getAllAttendance = async () => {
  return await Attendance.find();
};

export const createAttendanceRecord = async (data: {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: "Present" | "Absent";
}) => {
  return await Attendance.create(data);
};

export const updateAttendance = async (
  id: string,
  data: Partial<{
    checkIn: string;
    checkOut: string;
    status: "Present" | "Absent";
  }>
) => {
  const record = await Attendance.findByIdAndUpdate(id, data, { new: true });
  if (!record) throw new Error("Attendance record not found");
  return record;
};

// ── Payroll ────────────────────────────────────────────────────────────────

export const getAllPayroll = async () => {
  return await Payroll.find();
};

export const getPayrollById = async (id: string) => {
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};

export const createPayroll = async (data: {
  employeeId: string;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  netSalary: number;
}) => {
  return await Payroll.create(data);
};

export const updatePayroll = async (
  id: string,
  data: Partial<{
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
  }>
) => {
  const payroll = await Payroll.findByIdAndUpdate(id, data, { new: true });
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};

export const deletePayroll = async (id: string) => {
  const payroll = await Payroll.findByIdAndDelete(id);
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};
