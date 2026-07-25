import { Schema, model, Document } from "mongoose";

export interface INotification {
  bookId: string;
  bookCount: number;
  message: string;
}

// هذا النوع سيمتد من Document و INotification معاً
export interface INotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<INotificationDocument>({
  bookId: { type: String, required: true },
  bookCount: { type: Number, required: true },
  message: { type: String, required: true },
});

const Notification = model<INotificationDocument>(
  "Notification",
  notificationSchema,
);
export default Notification;
