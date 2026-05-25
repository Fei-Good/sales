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
    const userDoc = await users.findOne({ username });
    if (!userDoc) throw new NotFoundException('User not found');

    if (dto.deposite > 0 && dto.phoneNumber) {
      const datePrefix = (dto.time || '').slice(0, 10);
      const existing = await this.db.collection('order').findOne({
        phoneNumber: dto.phoneNumber,
        time: { $regex: `^${datePrefix}` },
        deposite: { $gt: 0 },
      });
      if (existing) {
        dto.deposite = 0;
        dto.totalMoney = (dto.totalMoney || 0) - 100;
      }
    }

    const orderNum = `${dto.time}-${username}-${++(userDoc as any).orders}`;
    const printTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const doc = { ...dto, saler: username, orderNum, printTime };
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

  async findForExport(user: { username: string; powerId: string }, start?: string, end?: string) {
    const filter: any = {};
    if (user.powerId !== '2') filter.saler = user.username;
    if (start && end) filter.time = { $gte: start, $lte: end + ' 23:59:59' };
    return this.db.collection('order').find(filter).sort({ time: -1 }).toArray();
  }

  async checkDeposit(phone: string, date: string): Promise<boolean> {
    if (!phone || phone.length < 4) return false;
    const filter = phone.length >= 11
      ? { phoneNumber: phone, time: { $regex: `^${date}` }, deposite: { $gt: 0 } }
      : { phoneNumber: { $regex: `${phone}$` }, time: { $regex: `^${date}` }, deposite: { $gt: 0 } };
    const existing = await this.db.collection('order').findOne(filter);
    return !!existing;
  }
}
