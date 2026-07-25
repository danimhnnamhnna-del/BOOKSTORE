import Transaction, { ITransaction } from "../models/Transaction";
import { BaseService } from "./BaseService";
import { Log } from "../decorators";
import BookService from "./BookService";

export class TransactionService extends BaseService<ITransaction> {
  constructor() {
    super(Transaction);
  }

  /**
   * Retrieves all currently active borrowings.
   */
  @Log
  async getActiveBorrows(): Promise<ITransaction[]> {
    return Transaction.find({
      type: "borrow",
      borrowStatus: "borrowed",
    });
  }

  /**
   * Handles the return of a borrowed book.
   * Updates transaction status, recalculates overdue fees, and updates book stock.
   */
  @Log
  async returnBook(transactionId: string): Promise<ITransaction> {
    if (!transactionId) throw new Error("Transaction ID is required");

    // 1. Fetch and validate the target transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.type !== "borrow")
      throw new Error("This transaction is not a borrow type");
    if (transaction.borrowStatus === "returned")
      throw new Error("Book has already been returned");

    // 2. Safeguard check: Verify bookId exists in record properties before running toString()
    if (!transaction.bookId) {
      throw new Error(
        "Transaction record data corruption: The 'bookId' field is missing or undefined inside this database document.",
      );
    }

    const bookId = transaction.bookId.toString();
    const book = await BookService.findById(bookId);
    if (!book)
      throw new Error(
        "Associated book details could not be found in inventory",
      );

    // 3. Recalculate late fees if returned past the expected date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (transaction.returnBorrowDate) {
      const expectedReturn = new Date(transaction.returnBorrowDate);
      expectedReturn.setHours(0, 0, 0, 0);

      // If today is past the expected return date, add overdue charges
      if (today > expectedReturn) {
        const diffTime = today.getTime() - expectedReturn.getTime();
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const dailyFee = Number(book.borrowFeeDaily) || 0;
        const extraFee = overdueDays * dailyFee;

        transaction.lateFee = (transaction.lateFee || 0) + extraFee;
        transaction.profit = (transaction.profit || 0) + extraFee;
      }
    }

    // 4. Trigger the new BookService inventory function (+1 count, -1 borrowedCount)
    await BookService.returnBookStock(bookId);

    // 5. Update transaction state and save changes
    transaction.borrowStatus = "returned";
    return transaction.save();
  }

  @Log
  async processTransaction(data: any) {
    const {
      type,
      bookId,
      customerName,
      customerPhone,
      customerAddress,
      returnBorrowDate,
    } = data;

    if (!bookId) throw new Error("Book ID is required");

    const book = await BookService.findById(bookId);
    if (!book) throw new Error("Book not found");
    if (!customerName) throw new Error("Customer name is required");

    const resolvedBookName =
      book.name || (book as any).title || (book as any).bookName;
    if (!resolvedBookName) {
      throw new Error(
        `Transaction aborted: Found book entity by ID but it contains no accessible name or title properties.`,
      );
    }

    let parsedReturnDate: Date | undefined;
    let lateFee = 0;
    let profit = 0;
    let borrowedDays = 0;
    let borrowStatus: string | undefined = undefined;

    if (type === "borrow") {
      if (!customerPhone)
        throw new Error("Customer phone is required for borrowing");
      if (!customerAddress)
        throw new Error("Customer address is required for borrowing");
      if (!returnBorrowDate)
        throw new Error("Return date is required for borrowing");

      parsedReturnDate = new Date(returnBorrowDate);
      if (isNaN(parsedReturnDate.valueOf())) {
        throw new Error("Return date is invalid");
      }

      const borrowStart = new Date();
      borrowStart.setHours(0, 0, 0, 0);
      const borrowEnd = new Date(parsedReturnDate);
      borrowEnd.setHours(0, 0, 0, 0);

      borrowedDays = Math.max(
        1,
        Math.ceil(
          (borrowEnd.getTime() - borrowStart.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      lateFee = borrowedDays * (Number(book.borrowFeeDaily) || 0);
      profit = lateFee;
      borrowStatus = "borrowed";
    } else if (type === "purchase") {
      profit = Number(book.price) || 0;
    }

    await BookService.updateStock(bookId, type);

    const transaction = new Transaction({
      type,
      bookId,
      bookName: resolvedBookName,
      customerName,
      customerPhone,
      customerAddress,
      transactionDate: new Date(),
      returnBorrowDate: parsedReturnDate,
      lateFee,
      profit,
      borrowedDays,
      borrowStatus,
    });

    return transaction.save();
  }
}

export default new TransactionService();
