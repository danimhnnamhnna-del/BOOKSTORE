// notificationRoutes.ts
import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";

const router = Router();
const notificationController = new NotificationController();

router.post("/request-notification", (req, res) =>
  notificationController.requestNotification(req, res),
);

// إذا أردت استخدام دوال CRUD الموروثة
router.get("/", (req, res) => notificationController.getAll(req, res));
router.get("/:id", (req, res) => notificationController.getById(req, res));
router.post("/", (req, res) => notificationController.create(req, res));
router.put("/:id", (req, res) => notificationController.update(req, res));
router.delete("/:id", (req, res) => notificationController.delete(req, res));

export default router;
