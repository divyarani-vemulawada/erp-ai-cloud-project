import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryItem extends Document {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  reorderLevel: number;
  unitCost: number;
  vendor: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventoryItemSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    warehouse: { type: String, required: true },
    stock: { type: Number, required: true },
    reorderLevel: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    vendor: { type: String, required: true },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
