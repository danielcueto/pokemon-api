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

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon) private pokemonsRepository: Repository<Pokemon>,
    private readonly typesService: TypesService,
  ) {}

  getAll(): Promise<Pokemon[]> {
    return this.pokemonsRepository.find();
  }

  async getById(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonsRepository.findOneBy({ id });
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
    const newPokemon = this.pokemonsRepository.create(pokemon);
    return this.pokemonsRepository.save(newPokemon);
  }

  async delete(id: string): Promise<void> {
    const pokemon = await this.getById(id);

    if (!pokemon) {
      throw new NotFoundException(`El Pokémon con ID ${id} no existe.`);
    }

    if (pokemon.trainerId) {
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
}
