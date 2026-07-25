import Notification, { INotificationDocument } from "../models/Notification";
import { BaseService } from "./BaseService";
import { Log } from "../decorators";

export class NotificationService extends BaseService<INotificationDocument> {
  constructor() {
    super(Notification);
  }

  @Log
  async requestNotification(bookId: string) {
    const Book = require("../models/Book").default;
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    return Notification.create({
      bookId: book._id,
      bookCount: book.count,
      message: `Customer requested notification for out-of-stock book: ${book.name}`,
    });
  }
}

export default new NotificationService();
