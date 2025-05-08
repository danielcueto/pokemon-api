import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';
import { TypesModule } from '../types/types.module';
import { TrainersModule } from '../trainers/trainers.module';
import { PokemonsResolver } from './pokemons.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon]), TypesModule, TrainersModule],
  controllers: [PokemonsController],
  providers: [PokemonsService, PokemonsResolver],
})
export class PokemonsModule {}
