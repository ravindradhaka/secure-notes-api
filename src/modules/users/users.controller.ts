// src/users/users.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';

@Controller('api/auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.create(createUserDto);
    return { message: 'User created successfully' };
  }

  @UseGuards(LocalStrategy)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtStrategy)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtStrategy)
  @Get('delete')
  deleteUser(@Request() req) {
    const userId = req.user;
    return this.usersService.deleteUser(userId);
  }
}
