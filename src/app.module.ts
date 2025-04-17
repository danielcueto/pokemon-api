import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsController } from './controllers/pokemons.controller';
import { TypesController } from './controllers/types.controller';
import { TrainersController } from './controllers/trainers.controller';
import { PokemonsService } from './services/pokemons.service';
import { TypesService } from './services/types.service';
import { TrainersService } from './services/trainers.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    PokemonsController,
    TypesController,
    TrainersController,
  ],
  providers: [AppService, PokemonsService, TypesService, TrainersService],
})
export class AppModule {}
