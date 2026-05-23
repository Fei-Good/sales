import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Controller('admin')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('Data')
  @UseGuards(JwtGuard)
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user);
  }

  @Post('insertoneOrder')
  @UseGuards(JwtGuard)
  create(@Body() dto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(dto, req.user.username);
  }

  @Post('updateoneOrder')
  @UseGuards(JwtGuard)
  update(@Body() dto: UpdateOrderDto) {
    const { _id, ...data } = dto;
    return this.ordersService.update(_id, data);
  }

  @Post('deleteOne')
  @UseGuards(JwtGuard)
  delete(@Body('_id') id: string) {
    return this.ordersService.delete(id);
  }
}
