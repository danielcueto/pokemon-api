import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  getAll() {
    return this.trainersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.trainersService.getById(id);
  }

  @Post()
  create(@Body() trainerDto: CreateTrainerDto) {
    return this.trainersService.create(trainerDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trainersService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() trainerDto: UpdateTrainerDto) {
    return this.trainersService.update(id, trainerDto);
  }
}
