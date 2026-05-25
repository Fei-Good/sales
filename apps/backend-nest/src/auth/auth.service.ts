import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(inputName: string, inputPassword: string, powerId: string) {
    const users = this.db.collection('user');
    const user = await users.findOne({ username: inputName, powerId });
    if (!user) throw new UnauthorizedException();

    let valid = false;
    if (user.password && !user.password.startsWith('$2')) {
      valid = user.password === inputPassword;
      if (valid) {
        const hashed = await bcrypt.hash(inputPassword, 10);
        await users.updateOne({ _id: user._id }, { $set: { password: hashed } });
      }
    } else {
      valid = await bcrypt.compare(inputPassword, user.password);
    }

    if (!valid) throw new UnauthorizedException();

    const payload = { sub: user._id.toString(), username: user.username, powerId: user.powerId };
    return { isLogined: true, token: this.jwtService.sign(payload) };
  }
}
