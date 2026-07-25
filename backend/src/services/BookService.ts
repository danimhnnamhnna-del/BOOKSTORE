import Book, { IBook } from "../models/Book";
import { BaseService } from "./BaseService";
import Notification from "../models/Notification";
import { Log } from "../decorators";

export class BookService extends BaseService<IBook> {
  constructor() {
    super(Book);
  }

  @Log
  async findAll() {
    return super.findAll();
  }

  @Log
  async findById(id: string) {
    return super.findById(id);
  }

  @Log
  private normalizeBookData(data: any) {
    const normalized = { ...data };

    if (normalized.count !== undefined)
      normalized.count = Number(normalized.count);
    if (normalized.price !== undefined)
      normalized.price = Number(normalized.price);
    if (normalized.borrowFeeDaily !== undefined) {
      normalized.borrowFeeDaily = Number(normalized.borrowFeeDaily);
    }

    return normalized;
  }

  @Log
  async create(data: any) {
    return super.create(this.normalizeBookData(data));
  }

  @Log
  async update(id: string, data: any) {
    return Book.findByIdAndUpdate(id, this.normalizeBookData(data), {
      new: true,
      runValidators: true,
    });
  }

  @Log
  async searchBooks(query: any) {
    const filter: any = {};

    if (query.q) {
      const searchRegex = new RegExp(query.q, "i");
      filter.$or = [
        { name: searchRegex },
        { author: searchRegex },
        { contentType: searchRegex },
        { category: searchRegex },
        { isbn: searchRegex },
      ];
    }

    if (query.name) filter.name = new RegExp(query.name, "i");
    if (query.isbn) filter.isbn = new RegExp(query.isbn, "i");
    if (query.author) filter.author = new RegExp(query.author, "i");
    if (query.contentType) filter.contentType = query.contentType;
    if (query.category) filter.category = query.category;

    return Book.find(filter);
  }

  @Log
  async updateStock(id: string, type: "borrow" | "purchase") {
    const book = await Book.findById(id);
    if (!book) throw new Error("Book not found");

    if (type === "borrow") {
      if (book.count < 3)
        throw new Error("Cannot borrow: stock too low (min 3 copies required)");
      book.count -= 1;
      book.borrowedCount += 1;
    } else if (type === "purchase") {
      if (book.count <= 0) throw new Error("Cannot purchase: out of stock");
      book.count -= 1;
      book.purchasedCount += 1;
    }

    await book.save();

    if (book.count < 3) {
      await Notification.create({
        bookId: book.id,
        bookCount: book.count,
        message: `Low stock alert: ${book.name} has only ${book.count} copies left.`,
      });
    }
    return book;
  }

  /**
   * New function: Handles the return inventory logic by adding 1 to stock count
   * and subtracting 1 from borrowedCount.
   */
  @Log
  async returnBookStock(id: string) {
    const book = await Book.findById(id);
    if (!book) throw new Error("Book not found");

    // Add 1 to the available stock count
    book.count += 1;

    // Subtract 1 from borrowedCount safely (prevent going below 0)
    if (book.borrowedCount > 0) {
      book.borrowedCount -= 1;
    }

    await book.save();
    return book;
  }
}

export default new BookService();
