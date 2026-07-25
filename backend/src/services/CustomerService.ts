import Customer, { ICustomer } from "../models/Customer";
import { Log } from "../decorators";
import { BaseService } from "./BaseService";

export class CustomerService extends BaseService<ICustomer> {
  constructor() {
    super(Customer);
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
  async create(data: any) {
    return super.create(data);
  }

  @Log
  async update(id: string, data: any) {
    return super.update(id, data);
  }

  @Log
  async delete(id: string) {
    return super.delete(id);
  }
}

export default new CustomerService();
