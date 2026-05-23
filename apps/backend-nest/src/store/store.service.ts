import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StoreService {
  constructor(private db: DatabaseService) {}

  private get col() {
    return this.db.collection('store');
  }

  async findAll() {
    return this.col.find().toArray();
  }

  async create(body: any) {
    const { _id, ...data } = body;
    const existing = await this.col.findOne({ name: data.name });
    if (existing) throw new BadRequestException('有相同的物品了');
    await this.col.insertOne(data);
  }

  async update(body: any) {
    const { _id, ...data } = body;
    const id = new ObjectId(_id);
    const current = await this.col.findOne({ _id: id });
    if (!current) throw new NotFoundException('Store item not found');
    data.total = parseInt(current.total) + parseInt(data.total);
    await this.col.updateOne({ _id: id }, { $set: data });
  }

  async delete(id: string) {
    await this.col.deleteOne({ _id: new ObjectId(id) });
  }
}
