import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PriceModule } from './price/price.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [DatabaseModule, AuthModule, OrdersModule, UsersModule, PriceModule, StoreModule],
})
export class AppModule {}
