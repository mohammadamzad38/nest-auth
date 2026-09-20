import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/register.dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerDto.password, saltRounds);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hash,
    });

    const payload = { sub: user?._id, role: 'admin' };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.userService.findUser(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid user crediential');
    }

    const matchPass = await bcrypt.compare(loginDto.password, user.password);

    if (!matchPass) {
      throw new UnauthorizedException('Invalid credientials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      // role: user.role,
    };

    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
