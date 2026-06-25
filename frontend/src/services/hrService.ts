import axios from "axios";
import type { Employee, LeaveRequest, Attendance, Payroll } from "../types/hr";

const hrApi = axios.create({
  baseURL: "http://localhost:1000/api/hr",
});

hrApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Employees ──────────────────────────────────────────────────────────────

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await hrApi.get("/employees");
  return response.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await hrApi.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (
  data: Omit<Employee, "id">
): Promise<Employee> => {
  const response = await hrApi.post("/employees", data);
  return response.data.employee;
};

export const updateEmployee = async (
  id: string,
  data: Partial<Omit<Employee, "id">>
): Promise<Employee> => {
  const response = await hrApi.put(`/employees/${id}`, data);
  return response.data.employee;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await hrApi.delete(`/employees/${id}`);
};

// ── Leave ──────────────────────────────────────────────────────────────────

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await hrApi.get("/leave");
  return response.data;
};

export const createLeaveRequest = async (
  data: Omit<LeaveRequest, "id" | "status">
): Promise<LeaveRequest> => {
  const response = await hrApi.post("/leave", data);
  return response.data.leave;
};

export const updateLeaveStatus = async (
  id: string,
  status: LeaveRequest["status"]
): Promise<LeaveRequest> => {
  const response = await hrApi.put(`/leave/${id}/status`, { status });
  return response.data.leave;
};

// ── Attendance ─────────────────────────────────────────────────────────────

export const getAttendance = async (): Promise<Attendance[]> => {
  const response = await hrApi.get("/attendance");
  return response.data;
};

export const createAttendance = async (
  data: Omit<Attendance, "id">
): Promise<Attendance> => {
  const response = await hrApi.post("/attendance", data);
  return response.data.record;
};

export const updateAttendance = async (
  id: string,
  data: Partial<Pick<Attendance, "checkIn" | "checkOut" | "status">>
): Promise<Attendance> => {
  const response = await hrApi.put(`/attendance/${id}`, data);
  return response.data.record;
};

// ── Payroll ────────────────────────────────────────────────────────────────

export const getPayroll = async (): Promise<Payroll[]> => {
  const response = await hrApi.get("/payroll");
  return response.data;
};

export const createPayroll = async (
  data: Omit<Payroll, "id">
): Promise<Payroll> => {
  const response = await hrApi.post("/payroll", data);
  return response.data.payroll;
};

export const updatePayroll = async (
  id: string,
  data: Partial<Omit<Payroll, "id" | "employeeId">>
): Promise<Payroll> => {
  const response = await hrApi.put(`/payroll/${id}`, data);
  return response.data.payroll;
};

export const deletePayroll = async (id: string): Promise<void> => {
  await hrApi.delete(`/payroll/${id}`);
};
