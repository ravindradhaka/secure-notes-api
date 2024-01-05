// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/user.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<UserEntity | null> {
    const { username, password } = loginUserDto;
    const user = await this.usersService.findByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(loginUserDto.username);

    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      const access_token = await this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      });

      return { access_token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserFromDB(userId: string): Promise<any> {
    const user = await this.usersService.findByUserId(userId);

    if (user && user.username) {
      return userId;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
