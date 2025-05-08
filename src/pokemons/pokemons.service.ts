import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { TypesService } from '../types/types.service';
import { TrainersService } from '../trainers/trainers.service';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon) private pokemonsRepository: Repository<Pokemon>,
    private readonly typesService: TypesService,
    private readonly trainersService: TrainersService,
  ) {}

  getAll(): Promise<Pokemon[]> {
    return this.pokemonsRepository.find({
      relations: ['trainer', 'type'],
    });
  }

  async getById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonsRepository.findOne({
      where: { id },
      relations: ['trainer', 'type'],
    });

    if (!pokemon) {
      throw new NotFoundException(`El Pokemon con el id: ${id}, no existe`);
    }

    return pokemon;
  }

  async create(pokemon: CreatePokemonDto): Promise<Pokemon> {
    const type = await this.typesService.findOne(pokemon.typeId);
    if (!type) {
      throw new NotFoundException(
        `El tipo con el id: ${pokemon.typeId}, no existe`,
      );
    }

    const newPokemon = this.pokemonsRepository.create({
      ...pokemon,
      type,
    });

    return this.pokemonsRepository.save(newPokemon);
  }

  async delete(id: string): Promise<void> {
    const pokemon = await this.getById(id);

    if (!pokemon) {
      throw new NotFoundException(`El Pokémon con ID ${id} no existe.`);
    }

    if (pokemon.trainer) {
      throw new BadRequestException(
        'No se puede eliminar un Pokémon capturado. Libéralo primero.',
      );
    }

    await this.pokemonsRepository.delete(id);
  }

  async update(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    if ('typeId' in updatePokemonDto) {
      throw new BadRequestException(
        'No puedes modificar el tipo de un Pokemon',
      );
    }

    const pokemon = await this.getById(id);
    this.pokemonsRepository.merge(pokemon, updatePokemonDto);

    return this.pokemonsRepository.save(pokemon);
  }

  async capture(id: string, trainerId: string): Promise<Pokemon> {
    const pokemon = await this.getById(id);

    if (pokemon.trainer) {
      throw new BadRequestException('Este Pokémon ya está capturado.');
    }

    const trainer = await this.trainersService.getById(trainerId);

    if (!trainer) {
      throw new NotFoundException(
        `El entrenador con el id: ${trainerId}, no existe`,
      );
    }

    pokemon.trainer = trainer;

    return this.pokemonsRepository.save(pokemon);
  }

  async levelUp(id: string): Promise<Pokemon> {
    const pokemon = await this.getById(id);

    if (!pokemon.trainer) {
      throw new BadRequestException('El Pokémon no está capturado.');
    }

    if (pokemon.level >= 100) {
      throw new BadRequestException(
        'El Pokémon ya ha alcanzado el nivel máximo.',
      );
    }

    pokemon.level += 1;

    return this.pokemonsRepository.save(pokemon);
  }

  async release(id: string): Promise<Pokemon> {
    const pokemon = await this.getById(id);

    if (!pokemon.trainer) {
      throw new BadRequestException('Este Pokémon ya está salvaje.');
    }

    pokemon.trainer = null;

    return this.pokemonsRepository.save(pokemon);
  }
}
