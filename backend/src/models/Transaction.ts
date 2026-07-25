import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  type: "borrow" | "purchase";
  bookId: mongoose.Types.ObjectId; // Added bookId to interface
  bookName: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  transactionDate: Date;
  returnBorrowDate?: Date;
  lateFee?: number;
  profit?: number;
  borrowedDays?: number;
  borrowStatus?: string;
}

const TransactionSchema: Schema = new Schema({
  type: { type: String, enum: ["borrow", "purchase"], required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // Added bookId to schema
  bookName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerAddress: { type: String },
  transactionDate: { type: Date, default: Date.now },
  returnBorrowDate: { type: Date },
  lateFee: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  borrowedDays: { type: Number, default: 0 },
  borrowStatus: { type: String, enum: ["borrowed", "returned"] },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
