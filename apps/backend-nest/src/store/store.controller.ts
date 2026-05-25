import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('admin')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('getstore')
  findAll() {
    return this.storeService.findAll();
  }

  @Post('insertStore')
  @UseGuards(JwtGuard)
  create(@Body() body) {
    return this.storeService.create(body);
  }

  @Post('updateStore')
  @UseGuards(JwtGuard)
  update(@Body() body) {
    return this.storeService.update(body);
  }

  @Post('deleStore')
  @UseGuards(JwtGuard)
  delete(@Body('_id') id: string) {
    return this.storeService.delete(id);
  }
}
