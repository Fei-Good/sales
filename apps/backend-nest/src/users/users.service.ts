import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  private get col() {
    return this.db.collection('user');
  }

  async findAll() {
    return this.col.find().toArray();
  }

  async findByUsername(username: string) {
    return this.col.findOne({ username });
  }

  async getUserMessage(username: string) {
    const user = await this.col.findOne({ username });
    if (!user) throw new NotFoundException();
    return { username: user.username, powerId: user.powerId };
  }

  async create(body: any) {
    const { _id, ...data } = body;
    const existing = await this.col.findOne({ username: data.username });
    if (existing) throw new BadRequestException('用户名号被注册了');
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.col.insertOne(data);
  }

  async update(body: any) {
    const { _id, ...data } = body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.col.updateOne({ _id: new ObjectId(_id) }, { $set: data });
  }

  async delete(body: any) {
    if (body.powerId === '2') throw new BadRequestException('无法删除本用户名');
    await this.col.deleteOne({ _id: new ObjectId(body._id) });
  }
}
