import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  async findAll(user: { username: string; powerId: string }) {
    const filter: any = {};
    if (user.powerId !== '2') filter.saler = user.username;
    const results = await this.db.collection('order').find(filter).toArray();
    return results.reverse();
  }

  async create(dto: any, username: string) {
    const users = this.db.collection('user');
    const userDoc = await users.findOne({ username });
    if (!userDoc) throw new NotFoundException('User not found');
    const orderNum = `${dto.time}-${username}-${++(userDoc as any).orders}`;
    const doc = { ...dto, saler: username, orderNum };
    const result = await this.db.collection('order').insertOne(doc);
    await users.updateOne({ _id: userDoc._id }, { $set: { orders: (userDoc as any).orders } });
    return { result: { ...doc, _id: result.insertedId } };
  }

  async update(id: string, data: any) {
    await this.db.collection('order').updateOne({ _id: new ObjectId(id) }, { $set: data });
  }

  async delete(id: string) {
    await this.db.collection('order').deleteOne({ _id: new ObjectId(id) });
  }
}
