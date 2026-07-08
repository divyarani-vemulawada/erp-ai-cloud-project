import mongoose, { Schema, Document } from "mongoose";

export interface IPeriodLock extends Document {
  month: number; // 1 to 12
  year: number;
  locked: boolean;
  lockedBy: string;
  lockedAt: Date;
}

const PeriodLockSchema = new Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    locked: { type: Boolean, default: false },
    lockedBy: { type: String, required: true },
    lockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure unique month+year locking configuration
PeriodLockSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPeriodLock>("PeriodLock", PeriodLockSchema);
