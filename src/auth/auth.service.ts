import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createUserDto: CreateUserDto) {
    const user = await this.validateUser(createUserDto);
    return this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (!user) {
      throw new BadRequestException('Error al crear el usuario');
    }
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload: JwtPayload = { username: user.username, sub: user.username };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        username: user.username,
      },
    };
  }

  async validateUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const user = await this.userService.findOne(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario o credenciales inválidas');
    }
    return user;
  }
}
