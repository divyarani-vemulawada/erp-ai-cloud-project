import LeaveRequest from "../../models/hr/Leave";

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
    { returnDocument: 'after' }
  );
  if (!leave) throw new Error("Leave request not found");
  return leave;
};
