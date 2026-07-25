import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import notificationService from "../services/NotificationService";
import { INotificationDocument } from "../models/Notification";

export class NotificationController extends BaseController<INotificationDocument> {
  constructor() {
    super(notificationService);   // ⬅️ استدعاء super مع الخدمة
  }

  async requestNotification(req: Request, res: Response) {
    try {
      const { bookId } = req.body as { bookId?: string };
      if (!bookId) return res.status(400).json({ message: "bookId required" });
      const notification = await notificationService.requestNotification(bookId);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}