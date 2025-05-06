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
    if (!createTypeDto.name) {
      throw new BadRequestException('El nombre del tipo es obligatorio');
    }

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
    if (!id) {
      throw new BadRequestException('El id es obligatorio');
    }
    const type = await this.typesRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    return type;
  }

  async update(id: string, updateTypeDto: UpdateTypeDto): Promise<Type> {
    const type = await this.findOne(id);
    if (!type) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    if (!updateTypeDto.name || !id) {
      throw new BadRequestException('Error, envia el nombre y el id del tipo');
    }
    this.typesRepository.merge(type, updateTypeDto);
    return this.typesRepository.save(type);
  }

  async remove(id: string): Promise<void> {
    // Check if any Pokémon are associated with this type
    const typesWithRelations = await this.typesRepository.findOne({
      where: { id },
      relations: ['pokemons'],
    });

    if (
      typesWithRelations &&
      typesWithRelations.pokemons &&
      typesWithRelations.pokemons.length > 0
    ) {
      throw new BadRequestException(
        `No se puede eliminar el tipo porque está asociado a ${typesWithRelations.pokemons.length} Pokémon`,
      );
    }

    await this.typesRepository.delete(id);
  }
}
