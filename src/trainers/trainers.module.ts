import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { Trainer } from './entities/trainer.entity';
import { TrainersResolver } from './trainers.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer])],
  controllers: [TrainersController],
  providers: [TrainersService, TrainersResolver],
  exports: [TrainersService],
})
export class TrainersModule {}
