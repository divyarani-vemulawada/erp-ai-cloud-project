import { Request, Response } from "express";
import {
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus
} from "../../services/hr/leaveService";

export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const leaves = await getAllLeaveRequests();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
};

export const addLeaveRequest = async (req: Request, res: Response) => {
  try {
    const leave = await createLeaveRequest(req.body);
    res.status(201).json({ message: "Leave request submitted successfully", leave });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

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
