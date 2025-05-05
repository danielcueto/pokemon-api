import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepository.create(createUserDto);
    const existingUser = await this.userRepository.findOne({
      where: { username: newUser.username },
    });
    if (existingUser) {
      throw new BadRequestException(
        `El usuario con el username: ${newUser.username} ya existe`,
      );
    }
    const hashedPassword = bcrypt.hashSync(newUser.password, 10);
    newUser.password = hashedPassword;
    return this.userRepository
      .save(newUser)
      .then((user) => plainToInstance(User, user));
  }

  findAll(): Promise<User[]> {
    return this.userRepository
      .find()
      .then((users) => plainToInstance(User, users));
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(
        `El usuario con el username: ${username}, no existe`,
      );
    }
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(
        `El usuario con el username: ${username}, no existe`,
      );
    }
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (!user) {
      throw new BadRequestException(
        `El usuario con el username: ${username}, no existe`,
      );
    }
    await this.userRepository.delete({ username });
  }
}
