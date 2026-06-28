import { Request, Response } from "express";
import {
  getAllAttendance,
  createAttendanceRecord,
  updateAttendance
} from "../../services/hr/attendanceService";

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const records = await getAllAttendance();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};

export const addAttendance = async (req: Request, res: Response) => {
  try {
    const record = await createAttendanceRecord(req.body);
    res.status(201).json({ message: "Attendance record created successfully", record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editAttendance = async (req: Request, res: Response) => {
  try {
    const record = await updateAttendance(String(req.params.id), req.body);
    res.status(200).json({ message: "Attendance updated successfully", record });
  } catch (error: any) {
    const statusCode = error.message === "Attendance record not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
