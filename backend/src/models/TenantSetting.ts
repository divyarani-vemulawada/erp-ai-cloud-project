import mongoose, { Schema, Document } from "mongoose";

export interface ITenantSetting extends Document {
  companyName: string;
  tenantCode: string;
  baseCurrency: string;
  timezone: string;
  approvalLimit: number;
  mfaRequired: boolean;
  emailNotifications: boolean;
}

const TenantSettingSchema = new Schema(
  {
    companyName: { type: String, default: "Amdox Technologies" },
    tenantCode: { type: String, default: "AMX-ERP" },
    baseCurrency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    approvalLimit: { type: Number, default: 100000 },
    mfaRequired: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<ITenantSetting>("TenantSetting", TenantSettingSchema);
