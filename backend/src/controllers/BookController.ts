import { Request, Response } from 'express';
import { IBook } from '../models/Book';
import BookService from '../services/BookService';
import { BaseController } from './BaseController';

export class BookController extends BaseController<IBook> {
  constructor() {
    super(BookService);
  }

  async search(req: Request, res: Response) {
    try {
      const results = await BookService.searchBooks(req.query);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new BookController();
