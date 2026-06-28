import { Request, Response } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../../services/hr/employeeService";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeById(String(req.params.id));
    res.status(200).json(employee);
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createEmployee(req.body);
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await updateEmployee(String(req.params.id), req.body);
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export const removeEmployee = async (req: Request, res: Response) => {
  try {
    await deleteEmployee(String(req.params.id));
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message === "Employee not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
