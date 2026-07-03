import mongoose, { Schema, Document } from "mongoose";

export interface IWidgetConfig {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large" | "full";
  order: number;
}

export interface IDashboardConfig extends Document {
  userId: mongoose.Types.ObjectId | string;
  layout: IWidgetConfig[];
}

const WidgetConfigSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  size: { type: String, enum: ["small", "medium", "large", "full"], required: true },
  order: { type: Number, required: true },
});

const DashboardConfigSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    layout: [WidgetConfigSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IDashboardConfig>("DashboardConfig", DashboardConfigSchema);
