import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt.guard';

@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.inputName, dto.inputPassword, dto.powerId);
  }

  @UseGuards(JwtGuard)
  @Get('checkLogin')
  checkLogin(@Req() req) {
    return { isLogined: !!req.user };
  }
}
