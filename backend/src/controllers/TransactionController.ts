import { Request, Response } from "express";
import { ITransaction } from "../models/Transaction";
import TransactionService from "../services/TransactionService";
import { BaseController } from "./BaseController";

export class TransactionController extends BaseController<ITransaction> {
  constructor() {
    super(TransactionService);
  }

  async process(req: Request, res: Response) {
    try {
      const transaction = await TransactionService.processTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * GET /api/transactions/active-borrows
   * Retrieves all transactions that are currently unreturned borrows.
   */
  async getActiveBorrows(req: Request, res: Response) {
    try {
      const activeBorrows = await TransactionService.getActiveBorrows();
      res.status(200).json(activeBorrows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * POST /api/transactions/return/:id
   * Processes a book return, adjusts stock counts, and updates overdue fees.
   */
  async returnBook(req: Request, res: Response) {
    try {
      const rawId = req.params.id;

      // Ensure id exists
      if (!rawId) {
        return res
          .status(400)
          .json({ message: "Transaction ID parameter is missing" });
      }

      // Safe extraction: handles single string or array strings variant type
      const id: string = Array.isArray(rawId)
        ? String(rawId[0])
        : String(rawId);

      const updatedTransaction = await TransactionService.returnBook(id);
      res.status(200).json(updatedTransaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TransactionController();
