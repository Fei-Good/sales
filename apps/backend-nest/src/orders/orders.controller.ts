import { Controller, Get, Post, Body, Query, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Controller('admin')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('Data')
  @UseGuards(JwtGuard)
  findAll(@Req() req, @Query('phoneSuffix') phoneSuffix?: string) {
    return this.ordersService.findAll(req.user, phoneSuffix);
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

  @Get('exportOrders')
  @UseGuards(JwtGuard)
  async exportCsv(@Req() req, @Query('start') start: string, @Query('end') end: string, @Res() res: Response) {
    const data = await this.ordersService.findForExport(req.user, start, end);
    const header = '订单号,日期,平台,支付方式,成人,儿童,总价,押金,退押金,售票员,手机号,备注,打印时间\n';
    const rows = data.map((o: any) =>
      [o.orderNum, o.time, o.platform, o.payWay, o.adultNum, o.childNum, o.totalMoney, o.deposite, o.isReback === 'true' ? '已退' : (o.deposite === 0 ? '无押金' : '未退'), o.saler, o.phoneNumber || '', o.remark || '', o.printTime || ''].join(',')
    ).join('\n');
    const bom = '﻿';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(bom + header + rows);
  }

}
