import { Injectable, NotFoundException } from '@nestjs/common';
import { Trainer } from './trainer.entity';
import { CreateTrainerDto, UpdateTrainerDto } from './trainer.dto';

@Injectable()
export class TrainersService {
  private trainers: Trainer[] = [
    {
      id: 1,
      name: 'Ash',
      second_name: 'Ketchum',
      age: 10,
      region: 'Kanto',
      badges: 8,
    },
    {
      id: 2,
      name: 'Misty',
      second_name: 'Waterflower',
      age: 12,
      region: 'Kanto',
      badges: 3,
    },
  ];

  getAll(): Trainer[] {
    return this.trainers;
  }

  getById(id: number): Trainer {
    const trainer = this.trainers.find((trainer) => trainer.id === id);
    if (!trainer) {
      throw new NotFoundException(`El trainer con el id ${id}, no existe`);
    }
    return trainer;
  }

  create(trainer: CreateTrainerDto): Trainer {
    const newTrainer: Trainer = { id: this.trainers.length + 1, ...trainer };
    this.trainers.push(newTrainer);
    return newTrainer;
  }

  delete(id: number): void {
    const index = this.trainers.findIndex((trainer) => trainer.id === id);
    if (index === -1) {
      throw new NotFoundException(`El trainer con el id ${id}, no existe`);
    }
    this.trainers.splice(index, 1);
  }

  update(id: number, trainer: UpdateTrainerDto): Trainer {
    const index = this.trainers.findIndex((trainer) => trainer.id === id);
    if (index === -1) {
      throw new NotFoundException(`El trainer con el id ${id}, no existe`);
    }
    this.trainers[index] = { ...this.trainers[index], ...trainer };
    return this.trainers[index];
  }
}
