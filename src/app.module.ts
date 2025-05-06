import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { TrainersModule } from './trainers/trainers.module';
import { TypesModule } from './types/types.module';
import { DatabaseModule } from './database/database.module';
import { TypesGrpcModule } from './types-grpc/types-grpc.module';

@Module({
  imports: [
    PokemonsModule,
    TrainersModule,
    TypesModule,
    DatabaseModule,
    TypesGrpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
