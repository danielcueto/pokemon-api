import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { Type } from './entities/type.entity';
import { TypesResolver } from './types.resolver';
import { Pokemon } from '../pokemons/entities/pokemon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Type, Pokemon])],
  controllers: [TypesController],
  providers: [TypesService, TypesResolver],
  exports: [TypesService],
})
export class TypesModule {}
