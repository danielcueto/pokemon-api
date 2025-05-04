import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type) private typesRepository: Repository<Type>,
  ) {}

  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    createTypeDto.name = createTypeDto.name.toLowerCase().trim();
    const existingType = await this.typesRepository.findOneBy({
      name: createTypeDto.name,
    });
    if (existingType) {
      throw new BadRequestException(
        `El tipo con el nombre ${createTypeDto.name} ya existe`,
      );
    }

    const newType = this.typesRepository.create(createTypeDto);
    return this.typesRepository.save(newType);
  }

  findAll(): Promise<Type[]> {
    return this.typesRepository.find();
  }

  async findOne(id: string): Promise<Type> {
    const type = await this.typesRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    return type;
  }

  async update(id: string, updateTypeDto: UpdateTypeDto): Promise<Type> {
    const type = await this.findOne(id);
    this.typesRepository.merge(type, updateTypeDto);
    return this.typesRepository.save(type);
  }

  remove(id: string): Promise<void> {
    return this.typesRepository.delete(id).then(() => {});
  }
}
