import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  projectCode: string;
  name: string;
  owner: string;
  startDate: string;
  dueDate: string;
  budget: number;
  actualSpend: number;
  progress: number;
  status: "Planning" | "Active" | "At Risk" | "Completed";
}

const ProjectSchema = new Schema(
  {
    projectCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    startDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    budget: { type: Number, required: true },
    actualSpend: { type: Number, default: 0 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: {
      type: String,
      enum: ["Planning", "Active", "At Risk", "Completed"],
      default: "Planning",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
