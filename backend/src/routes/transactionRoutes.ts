import { Router } from "express";
import TransactionController from "../controllers/TransactionController";

const router = Router();

// Static retrieval routes
router.get("/active-borrows", (req, res) =>
  TransactionController.getActiveBorrows(req, res),
);
router.get("/", (req, res) => TransactionController.getAll(req, res));

// Transaction submission routes
router.post("/process", (req, res) => TransactionController.process(req, res));

/**
 * ✅ UPDATED TO PUT
 * PUT /api/transactions/return/:id
 * Processes a book return using the PUT method structure.
 */
router.put("/return/:id", (req, res) =>
  TransactionController.returnBook(req, res),
);

export default router;
