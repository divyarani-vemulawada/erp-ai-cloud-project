import { Request, Response } from "express";
import {
  getAllPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll
} from "../../services/hr/payrollService";

export const getPayroll = async (req: Request, res: Response) => {
  try {
    const records = await getAllPayroll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payroll records" });
  }
};

export const addPayroll = async (req: Request, res: Response) => {
  try {
    const payroll = await createPayroll(req.body);
    res.status(201).json({ message: "Payroll record created successfully", payroll });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editPayroll = async (req: Request, res: Response) => {
  try {
    const payroll = await updatePayroll(String(req.params.id), req.body);
    res.status(200).json({ message: "Payroll updated successfully", payroll });
  } catch (error: any) {
    const statusCode = error.message === "Payroll record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export const removePayroll = async (req: Request, res: Response) => {
  try {
    await deletePayroll(String(req.params.id));
    res.status(200).json({ message: "Payroll record deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message === "Payroll record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
