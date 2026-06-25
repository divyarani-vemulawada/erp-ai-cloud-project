import { Request, Response } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  getAllAttendance,
  createAttendanceRecord,
  updateAttendance,
  getAllPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll
} from "../services/hrService";

// ── Employees ──────────────────────────────────────────────────────────────

// Get All Employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// Get Employee By Id
export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeById(String(req.params.id));
    res.status(200).json(employee);
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// Create Employee
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createEmployee(req.body);
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update Employee
export const editEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await updateEmployee(String(req.params.id), req.body);
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// Delete Employee
export const removeEmployee = async (req: Request, res: Response) => {
  try {
    await deleteEmployee(String(req.params.id));
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// ── Leave Requests ─────────────────────────────────────────────────────────

// Get All Leave Requests
export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const leaves = await getAllLeaveRequests();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
};

// Create Leave Request
export const addLeaveRequest = async (req: Request, res: Response) => {
  try {
    const leave = await createLeaveRequest(req.body);
    res.status(201).json({ message: "Leave request submitted successfully", leave });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update Leave Status
export const changeLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const leave = await updateLeaveStatus(String(req.params.id), status);
    res.status(200).json({ message: "Leave status updated successfully", leave });
  } catch (error: any) {
    const statusCode = error.message === "Leave request not found" ? 404 : 400;
    res.status(statusCode).json({ message: error.message });
  }
};

// ── Attendance ─────────────────────────────────────────────────────────────

// Get All Attendance
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const records = await getAllAttendance();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};

// Create Attendance Record
export const addAttendance = async (req: Request, res: Response) => {
  try {
    const record = await createAttendanceRecord(req.body);
    res.status(201).json({ message: "Attendance record created successfully", record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update Attendance
export const editAttendance = async (req: Request, res: Response) => {
  try {
    const record = await updateAttendance(String(req.params.id), req.body);
    res.status(200).json({ message: "Attendance updated successfully", record });
  } catch (error: any) {
    const statusCode = error.message === "Attendance record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// ── Payroll ────────────────────────────────────────────────────────────────

// Get All Payroll
export const getPayroll = async (req: Request, res: Response) => {
  try {
    const records = await getAllPayroll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payroll records" });
  }
};

// Create Payroll
export const addPayroll = async (req: Request, res: Response) => {
  try {
    const payroll = await createPayroll(req.body);
    res.status(201).json({ message: "Payroll record created successfully", payroll });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update Payroll
export const editPayroll = async (req: Request, res: Response) => {
  try {
    const payroll = await updatePayroll(String(req.params.id), req.body);
    res.status(200).json({ message: "Payroll updated successfully", payroll });
  } catch (error: any) {
    const statusCode = error.message === "Payroll record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// Delete Payroll
export const removePayroll = async (req: Request, res: Response) => {
  try {
    await deletePayroll(String(req.params.id));
    res.status(200).json({ message: "Payroll record deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message === "Payroll record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
