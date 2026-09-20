import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserService } from '../user/user.service.js';
import { LoginDto } from './dto/register.dto/login.dto.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { AuthGuardGuard } from './auth.guard/auth.guard.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const token = await this.authService.registerUser(registerDto);

    return token;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const logedUser = await this.authService.loginUser(loginDto);
    return logedUser;
  }

  @UseGuards(AuthGuardGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const userId = req.user.sub;

    const user = await this.userService.getUserById(userId);

    return user;
  }
}
