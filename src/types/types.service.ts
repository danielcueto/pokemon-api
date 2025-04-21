import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  private types: Type[] = [
    {
      id: 1,
      name: 'Fire',
    },
    {
      id: 2,
      name: 'Water',
    },
    {
      id: 3,
      name: 'Grass',
    },
  ];

  create(createTypeDto: CreateTypeDto): Type {
    const newType: Type = {
      id: this.types.length + 1,
      ...createTypeDto,
    };
    this.types.push(newType);
    return newType;
  }

  findAll(): Type[] {
    return this.types;
  }

  findOne(id: number): Type {
    const type = this.types.find((type) => type.id === id);
    if (!type) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    return type;
  }

  update(id: number, updateTypeDto: UpdateTypeDto): Type {
    const typeIndex = this.types.findIndex((type) => type.id === id);
    if (typeIndex === -1) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    this.types[typeIndex] = { ...this.types[typeIndex], ...updateTypeDto };
    return this.types[typeIndex];
  }

  remove(id: number): void {
    const typeIndex = this.types.findIndex((type) => type.id === id);
    if (typeIndex === -1) {
      throw new NotFoundException(`El tipo con el id ${id}, no existe`);
    }
    this.types.splice(typeIndex, 1);
  }
}
