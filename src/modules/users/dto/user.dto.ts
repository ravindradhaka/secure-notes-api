// src/users/dto/user.dto.ts

import { IsString, IsEmail, IsPhoneNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers.',
  })
  readonly username: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
    {
      message: 'Password must meet the complexity requirements.',
    },
  )
  readonly password: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly name?: string;

  @IsPhoneNumber()
  readonly phoneNumber?: string;
}

export class LoginUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
    {
      message: 'Password must meet the complexity requirements.',
    },
  )
  readonly password: string;
}
