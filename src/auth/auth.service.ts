import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userSerice: UsersService) {}

  async login(createUserDto: CreateUserDto): Promise<string> {
    const { username, password } = createUserDto;
    const user = await this.userSerice.findOne(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario o credenciales inválidas');
    }

    //GENERACION DEL FAKIN TOKEN
    const token = randomBytes(16).toString('hex');
    user.token = token;
    await this.userSerice.update(username, user);
    return token;
  }

  async logout(token: string): Promise<string> {
    const user = await this.userSerice.findToken(token);
    if (!user) throw new UnauthorizedException('Token inválido o no existe');
    user.token = null;
    await this.userSerice.update(user.username, user);
    return 'Logout exitoso';
  }

  async register(createUserDto: CreateUserDto): Promise<string> {
    const user = await this.userSerice.create(createUserDto);
    if (!user) {
      throw new BadRequestException('Error al crear el usuario');
    }
    return this.login(createUserDto);
  }

  async validateToken(token: string): Promise<boolean> {
    const user = await this.userSerice.findToken(token);
    if (!user) throw new UnauthorizedException('Token inválido o no existe');
    return true;
  }
}
