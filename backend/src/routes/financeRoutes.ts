import express from "express";
import FinanceTransaction from "../models/FinanceTransaction";
import PeriodLock from "../models/PeriodLock";
import { protect, authorize } from "../middleware/authMiddleware";
import { isPeriodLocked } from "../utils/periodLockCheck";
import { getCachedFXRates } from "../utils/fxRates";

const router = express.Router();

// Get all transactions
router.get(
  "/transactions",
  protect,
  authorize("admin", "finance", "manager"),
  async (_req, res) => {
    const transactions = await FinanceTransaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  }
);

// Create transaction
router.post(
  "/transactions",
  protect,
  authorize("admin", "finance"),
  async (req, res) => {
    try {
      const { type, account, counterparty, amount, transactionDate } = req.body;
      let { debitAccount, creditAccount } = req.body;

      // 1. Double-Entry Validation
      if (type === "GL") {
        debitAccount = debitAccount || account;
        creditAccount = creditAccount || counterparty;

        if (!debitAccount || !creditAccount) {
          return res.status(400).json({ message: "Double-entry transactions require both a Debit and Credit account." });
        }
        if (debitAccount === creditAccount) {
          return res.status(400).json({ message: "Double-entry balanced validation failed: Debit and Credit accounts cannot be the same." });
        }
      }

      if (amount <= 0) {
        return res.status(400).json({ message: "Transaction amount must be greater than zero." });
      }

      // 2. Period Close Check (Admins are exempt)
      const userRole = (req as any).user?.role;
      if (userRole !== "admin") {
        const locked = await isPeriodLocked(transactionDate);
        if (locked) {
          return res.status(400).json({ message: "Cannot add transactions to a locked financial period." });
        }
      }

      const transaction = await FinanceTransaction.create({
        ...req.body,
        debitAccount,
        creditAccount
      });
      res.status(201).json({ message: "Transaction created", transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update transaction
router.put(
  "/transactions/:id",
  protect,
  authorize("admin", "finance"),
  async (req, res) => {
    try {
      const existing = await FinanceTransaction.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Transaction not found" });

      const { type, account, counterparty, amount, transactionDate } = req.body;
      let { debitAccount, creditAccount } = req.body;

      // 1. Double-Entry Validation
      if (type === "GL") {
        debitAccount = debitAccount || account || existing.account;
        creditAccount = creditAccount || counterparty || existing.counterparty;

        if (debitAccount === creditAccount) {
          return res.status(400).json({ message: "Double-entry balanced validation failed: Debit and Credit accounts cannot be the same." });
        }
      }

      if (amount !== undefined && amount <= 0) {
        return res.status(400).json({ message: "Transaction amount must be greater than zero." });
      }

      // 2. Period Close Check (Admins are exempt)
      const userRole = (req as any).user?.role;
      if (userRole !== "admin") {
        const wasLocked = await isPeriodLocked(existing.transactionDate);
        const willBeLocked = transactionDate ? await isPeriodLocked(transactionDate) : false;

        if (wasLocked || willBeLocked) {
          return res.status(400).json({ message: "Cannot modify transactions in a locked financial period." });
        }
      }

      const transaction = await FinanceTransaction.findByIdAndUpdate(
        req.params.id,
        { ...req.body, debitAccount, creditAccount },
        { returnDocument: 'after' }
      );
      res.json({ message: "Transaction updated", transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete transaction
router.delete(
  "/transactions/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const existing = await FinanceTransaction.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Transaction not found" });

      // Period Close Check (Admins are exempt)
      const userRole = (req as any).user?.role;
      if (userRole !== "admin") {
        const locked = await isPeriodLocked(existing.transactionDate);
        if (locked) {
          return res.status(400).json({ message: "Cannot delete transactions in a locked financial period." });
        }
      }

      await FinanceTransaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get period locks list
router.get(
  "/period-locks",
  protect,
  authorize("admin", "finance"),
  async (_req, res) => {
    try {
      const locks = await PeriodLock.find().sort({ year: -1, month: -1 });
      res.json(locks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Lock or unlock period (Admin or Finance only)
router.post(
  "/period-locks",
  protect,
  authorize("admin", "finance"),
  async (req, res) => {
    try {
      const { month, year, locked } = req.body;
      const userName = (req as any).user?.email || "System";

      if (!month || !year) {
        return res.status(400).json({ message: "Month and year are required." });
      }

      const period = await PeriodLock.findOneAndUpdate(
        { month, year },
        { locked, lockedBy: userName, lockedAt: new Date() },
        { upsert: true, new: true }
      );

      res.json({ message: `Period ${month}/${year} is now ${locked ? "LOCKED" : "UNLOCKED"}`, period });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get cached FX rates relative to INR base
router.get(
  "/rates",
  protect,
  async (_req, res) => {
    try {
      const rates = await getCachedFXRates();
      res.json(rates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
