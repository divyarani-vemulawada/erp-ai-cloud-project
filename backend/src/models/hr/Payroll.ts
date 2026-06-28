import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

const PayrollSchema = new Schema(
  {
    employeeId: {
      type: String,
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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model<IPayroll>("Payroll", PayrollSchema);
