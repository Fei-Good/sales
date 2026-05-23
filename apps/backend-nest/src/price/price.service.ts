import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PriceService {
  constructor(private db: DatabaseService) {}

  private get col() {
    return this.db.collection('price');
  }

  async findAll() {
    return this.col.find().toArray();
  }

  async create(body: any) {
    const { _id, ...data } = body;
    await this.col.insertOne(data);
  }

  async update(body: any) {
    const { _id, ...data } = body;
    await this.col.updateOne({ _id: new ObjectId(_id) }, { $set: data });
  }
}
