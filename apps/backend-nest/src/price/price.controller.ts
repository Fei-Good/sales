import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PriceService } from './price.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('admin')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get('price')
  findAll() {
    return this.priceService.findAll();
  }

  @Post('setprice')
  @UseGuards(JwtGuard)
  create(@Body() body) {
    return this.priceService.create(body);
  }

  @Post('updatePrice')
  @UseGuards(JwtGuard)
  update(@Body() body) {
    return this.priceService.update(body);
  }
}
