import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent";
}

const AttendanceSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    checkIn: {
      type: String,
      default: ""
    },

    checkOut: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);
