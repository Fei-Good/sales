import { Injectable, OnModuleInit } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PriceService implements OnModuleInit {
  constructor(private db: DatabaseService) {}

  private get col() {
    return this.db.collection('price');
  }

  async onModuleInit() {
    const count = await this.col.countDocuments();
    if (count === 0) {
      await this.col.insertOne({
        adultPrice: 78,
        childPrice: 60,
        plupPrice: 30,
        clothPrice: 50,
      });
    }
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
