import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  channel: "In-App" | "Email" | "SMS" | "Webhook";
  severity: "Info" | "Warning" | "Critical";
  status: "Unread" | "Read";
}

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: {
      type: String,
      enum: ["In-App", "Email", "SMS", "Webhook"],
      default: "In-App",
    },
    severity: {
      type: String,
      enum: ["Info", "Warning", "Critical"],
      default: "Info",
    },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
