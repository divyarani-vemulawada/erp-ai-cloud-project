import { Request, Response } from "express";
import {
  getAllPayslips,
  getPayslipById,
  getPayslipsByEmployee,
  createPayslip,
  deletePayslip
} from "../../services/hr/payslipService";

export const getPayslips = async (req: Request, res: Response) => {
  try {
    const payslips = await getAllPayslips();
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payslips" });
  }
};

export const getPayslip = async (req: Request, res: Response) => {
  try {
    const payslip = await getPayslipById(String(req.params.id));
    res.status(200).json(payslip);
  } catch (error: any) {
    const statusCode = error.message === "Payslip not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export const getEmployeePayslips = async (req: Request, res: Response) => {
  try {
    const payslips = await getPayslipsByEmployee(String(req.params.employeeId));
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payslips for employee" });
  }
};

export const addPayslip = async (req: Request, res: Response) => {
  try {
    const payslip = await createPayslip(req.body);
    res.status(201).json({ message: "Payslip generated successfully", payslip });
  } catch (error: any) {
    const statusCode = error.message.includes("already exists") ? 409 : 400;
    res.status(statusCode).json({ message: error.message });
  }
};

export const removePayslip = async (req: Request, res: Response) => {
  try {
    await deletePayslip(String(req.params.id));
    res.status(200).json({ message: "Payslip deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message === "Payslip not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
