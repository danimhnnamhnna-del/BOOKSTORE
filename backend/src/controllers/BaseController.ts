import { Request, Response } from "express";
import { BaseService } from "../services/BaseService";
import { Document } from "mongoose";

export abstract class BaseController<T extends Document> {
  constructor(protected service: BaseService<T>) {}

  async getAll(req: Request, res: Response) {
    try {
      const items = await this.service.findAll();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const item = await this.service.findById(String(req.params.id));
      if (item) res.json(item);
      else res.status(404).json({ message: "Item not found" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const item = await this.service.update(String(req.params.id), req.body);
      if (item) res.json(item);
      else res.status(404).json({ message: "Item not found" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const item = await this.service.delete(String(req.params.id));
      if (item) res.json({ message: "Item deleted" });
      else res.status(404).json({ message: "Item not found" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
