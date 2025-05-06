import {
  Controller,
  UsePipes,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TypesService } from '../types/types.service';
import { CreateTypeDto } from '../types/dto/create-type.dto';
import { Type } from '../types/entities/type.entity';
import { GrpcUpdateTypeDto } from './interfaces/grpc-update-type.dto';
import { UpdateTypeDto } from '../types/dto/update-type.dto';

// Interfaces que coinciden con las definiciones del archivo .proto
interface GrpcId {
  id: string;
}
interface TypeList {
  types: Type[];
}

@Controller()
export class TypesGrpcController {
  constructor(private readonly typesService: TypesService) {}

  @GrpcMethod('TypeService', 'Create')
  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    return await this.typesService.create(createTypeDto);
  }

  @GrpcMethod('TypeService', 'FindAll')
  async findAll(): Promise<TypeList> {
    const types = await this.typesService.findAll();
    return { types };
  }

  @GrpcMethod('TypeService', 'FindOne')
  async findOne(data: GrpcId): Promise<Type> {
    return await this.typesService.findOne(data.id);
  }

  @GrpcMethod('TypeService', 'Update')
  @UsePipes(
    new NestValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async update(data: GrpcUpdateTypeDto): Promise<Type> {
    const updateTypeDto: UpdateTypeDto = { name: data.name };
    return await this.typesService.update(data.id, updateTypeDto);
  }

  @GrpcMethod('TypeService', 'Remove')
  async remove(data: GrpcId): Promise<any> {
    await this.typesService.remove(data.id);
    return {};
  }
}
