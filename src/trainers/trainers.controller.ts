import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto, UpdateTrainerDto } from './trainer.dto';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  getAll() {
    return this.trainersService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: string) {
    return this.trainersService.getById(+id);
  }

  @Post()
  create(@Body() trainerDto: CreateTrainerDto) {
    return this.trainersService.create(trainerDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.trainersService.delete(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() trainerDto: UpdateTrainerDto,
  ) {
    return this.trainersService.update(+id, trainerDto);
  }
}
