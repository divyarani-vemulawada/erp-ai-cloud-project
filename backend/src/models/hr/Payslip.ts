import mongoose, { Schema, Document } from "mongoose";

export interface IPayslip extends Document {
  employeeId: string;
  payrollId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  generatedAt: Date;
  status: "Draft" | "Issued" | "Cancelled";
}

const PayslipSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true
    },

    payrollId: {
      type: String,
      required: true
    },

    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    basicSalary: {
      type: Number,
      required: true
    },

    allowances: {
      type: Number,
      default: 0
    },

    deductions: {
      type: Number,
      default: 0
    },

    netSalary: {
      type: Number,
      required: true
    },

    generatedAt: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["Draft", "Issued", "Cancelled"],
      default: "Draft"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model<IPayslip>("Payslip", PayslipSchema);
