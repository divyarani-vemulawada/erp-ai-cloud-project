import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId | string;
  email: string;
  role: string;
  action: string;
  method: string;
  path: string;
  details: string;
  ip: string;
}

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    method: { type: String, required: true },
    path: { type: String, required: true },
    details: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
