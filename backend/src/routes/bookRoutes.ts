import { Router } from "express";
import BookController from "../controllers/BookController";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", (req, res) => BookController.getAll(req, res));
router.get("/search", (req, res) => BookController.search(req, res));
router.get("/:id", (req, res) => BookController.getById(req, res));

router.post("/", (req, res) => {
  if (req.is("multipart/form-data")) {
    return upload.single("coverImage")(req, res, () => {
      if (req.file) {
        req.body.coverImage = `/uploads/${req.file.filename}`;
      }
      BookController.create(req, res);
    });
  }

  return BookController.create(req, res);
});

router.put("/:id", (req, res) => {
  if (req.is("multipart/form-data")) {
    return upload.single("coverImage")(req, res, () => {
      if (req.file) {
        req.body.coverImage = `/uploads/${req.file.filename}`;
      }
      BookController.update(req, res);
    });
  }

  return BookController.update(req, res);
});
router.delete("/:id", (req, res) => BookController.delete(req, res));

export default router;
