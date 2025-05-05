import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.login(createUserDto);
    return { token };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.register(createUserDto);
    return { token };
  }

  @Post('logout')
  logout(@Req() req: Request): Promise<string> {
    const token: string | undefined =
      req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Logueate primero perrito');
    }
    return this.authService.logout(token);
  }
}
