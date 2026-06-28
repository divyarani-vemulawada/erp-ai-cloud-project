import mongoose, { Schema, Document } from "mongoose";

export interface IFinanceTransaction extends Document {
  reference: string;
  type: "GL" | "AP" | "AR" | "Payment";
  account: string;
  counterparty: string;
  currency: string;
  amount: number;
  status: "Draft" | "Pending" | "Approved" | "Paid";
  transactionDate: string;
  description?: string;
}

const FinanceTransactionSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["GL", "AP", "AR", "Payment"],
      required: true,
    },
    account: { type: String, required: true },
    counterparty: { type: String, required: true },
    currency: { type: String, default: "INR" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Approved", "Paid"],
      default: "Pending",
    },
    transactionDate: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<IFinanceTransaction>(
  "FinanceTransaction",
  FinanceTransactionSchema
);
