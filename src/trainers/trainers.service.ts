import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { Pokemon } from '../pokemons/entities/pokemon.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainer) private trainersRepository: Repository<Trainer>,
  ) {}

  getAll(): Promise<Trainer[]> {
    return this.trainersRepository.find();
  }

  async getById(id: string): Promise<Trainer> {
    const trainer = await this.trainersRepository.findOneBy({ id });
    if (!trainer) {
      throw new NotFoundException(`El trainer con el id ${id}, no existe`);
    }
    return trainer;
  }

  create(trainer: CreateTrainerDto): Promise<Trainer> {
    const newTrainer: Trainer = this.trainersRepository.create(trainer);
    return this.trainersRepository.save(newTrainer);
  }

  delete(id: string): Promise<void> {
    return this.trainersRepository.delete(id).then(() => {});
  }

  async update(
    id: string,
    updateTrainerDto: UpdateTrainerDto,
  ): Promise<Trainer> {
    const trainer = await this.getById(id);
    this.trainersRepository.merge(trainer, updateTrainerDto);
    return this.trainersRepository.save(trainer);
  }

  async getPokemonsByTrainerId(id: string): Promise<Pokemon[]> {
    const trainer = await this.trainersRepository.findOne({
      where: { id },
      relations: ['pokemons'], // Asegúrate que la relación esté definida como OneToMany
    });

    if (!trainer) {
      throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
    }

    return trainer.pokemons;
  }
}
