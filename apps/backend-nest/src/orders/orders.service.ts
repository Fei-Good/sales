import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  async findAll(user: { username: string; powerId: string }, phoneSuffix?: string) {
    const filter: any = {};
    if (user.powerId !== '2') filter.saler = user.username;
    if (phoneSuffix) filter.phoneNumber = { $regex: `${phoneSuffix}$` };
    const results = await this.db.collection('order').find(filter).toArray();
    return results.reverse();
  }

  async create(dto: any, username: string) {
    const users = this.db.collection('user');
    const userDoc = await users.findOneAndUpdate(
      { username },
      { $inc: { orders: 1 } },
      { returnDocument: 'after' },
    );
    if (!userDoc) throw new NotFoundException('User not found');

    const orderNum = `${dto.time}-${username}-${userDoc.orders}`;
    const printTime = dto.time;
    const doc = { ...dto, saler: username, orderNum, printTime };
    const result = await this.db.collection('order').insertOne(doc);
    return { result: { ...doc, _id: result.insertedId } };
  }

  async update(id: string, data: any) {
    const result = await this.db.collection('order').updateOne({ _id: new ObjectId(id) }, { $set: data });
    return { matched: result.matchedCount, modified: result.modifiedCount };
  }

  async delete(id: string) {
    await this.db.collection('order').deleteOne({ _id: new ObjectId(id) });
  }

  async findForExport(user: { username: string; powerId: string }, start?: string, end?: string) {
    const filter: any = {};
    if (user.powerId !== '2') filter.saler = user.username;
    if (start && end) filter.time = { $gte: start, $lte: end + ' 23:59:59' };
    return this.db.collection('order').find(filter).sort({ time: -1 }).toArray();
  }

}
