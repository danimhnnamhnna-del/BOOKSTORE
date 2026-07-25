import { Model, Document } from "mongoose";

export abstract class BaseService<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findAll() {
     return this.model.find();
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async create(data: any) {
    const item = new this.model(data);
    return item.save();
  }

  async update(id: string, data: any) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
