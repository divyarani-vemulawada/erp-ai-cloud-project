import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  poNumber: string;
  vendor: string;
  item: string;
  quantity: number;
  expectedDate: string;
  amount: number;
  status: "Draft" | "Sent" | "Received" | "Cancelled";
}

const PurchaseOrderSchema = new Schema(
  {
    poNumber: { type: String, required: true, unique: true },
    vendor: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    expectedDate: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Received", "Cancelled"],
      default: "Draft",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
