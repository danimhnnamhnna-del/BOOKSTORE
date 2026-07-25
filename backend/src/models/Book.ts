import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  name: string;
  isbn: string;
  author: string;
  contentType: string; // scientific, literary, historical, etc.
  category: string;
  count: number;
  price: number;
  borrowFeeDaily: number;
  purchasedCount: number;
  borrowedCount: number;
  coverImage?: string;
}

const BookSchema: Schema = new Schema({
  name: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  contentType: { type: String, required: true },
  category: { type: String, required: true },
  count: { type: Number, required: true, default: 0, min: 0 },
  price: { type: Number, required: true, default: 0, min: 0 },
  borrowFeeDaily: { type: Number, required: true, default: 0, min: 0 },
  purchasedCount: { type: Number, required: true, default: 0 },
  borrowedCount: { type: Number, required: true, default: 0 },
  coverImage: { type: String },
});

export default mongoose.model<IBook>("Book", BookSchema);
