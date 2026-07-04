import express from "express";
import FinanceTransaction from "../models/FinanceTransaction";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/transactions",
  protect,
  authorize("admin", "finance", "manager"),
  async (_req, res) => {
    const transactions = await FinanceTransaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  }
);

router.post(
  "/transactions",
  protect,
  authorize("admin", "finance"),
  async (req, res) => {
    try {
      const transaction = await FinanceTransaction.create(req.body);
      res.status(201).json({ message: "Transaction created", transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/transactions/:id",
  protect,
  authorize("admin", "finance"),
  async (req, res) => {
    const transaction = await FinanceTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction updated", transaction });
  }
);

router.delete(
  "/transactions/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    const transaction = await FinanceTransaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  }
);

export default router;
