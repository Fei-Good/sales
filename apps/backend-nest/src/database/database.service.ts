import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sales';
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db('sales');
  }

  async onModuleDestroy() {
    await this.client?.close();
  }

  collection(name: string): Collection {
    return this.db.collection(name);
  }
}
