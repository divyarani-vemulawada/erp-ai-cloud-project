import express from "express";
import InventoryItem from "../models/InventoryItem";
import PurchaseOrder from "../models/PurchaseOrder";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();
const canManage = authorize("admin", "manager");
const canRead = authorize("admin", "manager", "finance");

router.get("/inventory", protect, canRead, async (_req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/inventory", protect, canManage, async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({ message: "Inventory item created", item });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/inventory/:id", protect, canManage, async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.status(404).json({ message: "Inventory item not found" });
  res.json({ message: "Inventory item updated", item });
});

router.delete("/inventory/:id", protect, authorize("admin"), async (req, res) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Inventory item not found" });
  res.json({ message: "Inventory item deleted" });
});

router.get("/purchase-orders", protect, canRead, async (_req, res) => {
  const orders = await PurchaseOrder.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/purchase-orders", protect, canManage, async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json({ message: "Purchase order created", order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/purchase-orders/:id", protect, canManage, async (req, res) => {
  const order = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!order) return res.status(404).json({ message: "Purchase order not found" });
  res.json({ message: "Purchase order updated", order });
});

export default router;
