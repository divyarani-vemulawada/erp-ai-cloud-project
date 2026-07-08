import mongoose, { Schema, Document } from "mongoose";

export interface IExchangeRate extends Document {
  currency: string; // e.g. "USD", "EUR", "GBP"
  rate: number; // rate relative to base (INR)
  updatedAt: Date;
}

const ExchangeRateSchema = new Schema(
  {
    currency: { type: String, required: true, unique: true, uppercase: true },
    rate: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IExchangeRate>("ExchangeRate", ExchangeRateSchema);
