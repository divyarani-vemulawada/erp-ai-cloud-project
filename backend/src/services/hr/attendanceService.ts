import Attendance from "../../models/hr/Attendance";

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
  const record = await Attendance.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!record) throw new Error("Attendance record not found");
  return record;
};
