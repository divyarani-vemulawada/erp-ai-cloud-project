import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const LeaveRequestSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true
    },

    leaveType: {
      type: String,
      required: true
    },

    startDate: {
      type: String,
      required: true
    },

    endDate: {
      type: String,
      required: true
    },

    reason: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);
