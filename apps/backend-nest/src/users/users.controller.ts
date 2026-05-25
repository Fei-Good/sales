import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('admin')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  @UseGuards(JwtGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('getSaler')
  @UseGuards(JwtGuard)
  getSaler(@Req() req) {
    return this.usersService.findByUsername(req.user.username);
  }

  @Get('userMessage')
  @UseGuards(JwtGuard)
  userMessage(@Req() req) {
    return this.usersService.getUserMessage(req.user.username);
  }

  @Post('insertuser')
  @UseGuards(JwtGuard)
  create(@Body() body) {
    return this.usersService.create(body);
  }

  @Post('updateuser')
  @UseGuards(JwtGuard)
  update(@Body() body) {
    return this.usersService.update(body);
  }

  @Post('deleteuser')
  @UseGuards(JwtGuard)
  delete(@Body() body) {
    return this.usersService.delete(body);
  }

  @Get('loginOut')
  logout() {
    return { status: 200 };
  }
}
