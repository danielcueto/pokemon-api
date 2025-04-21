import { Injectable, NotFoundException } from '@nestjs/common';
import { Pokemon } from './pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './pokemon.dto';

@Injectable()
export class PokemonsService {
  private pokemons: Pokemon[] = [
    {
      id: 1,
      name: 'Pikachu',
      level: 5,
      typeId: 1,
      trainerId: 3,
      attack: 55,
      defense: 40,
      speed: 90,
      isLegendary: false,
    },
    {
      id: 2,
      name: 'Charizard',
      level: 36,
      typeId: 4,
      trainerId: 2,
      attack: 84,
      defense: 78,
      speed: 100,
      isLegendary: false,
    },
  ];

  getAll(): Pokemon[] {
    return this.pokemons;
  }

  getById(id: number): Pokemon {
    const pokemon = this.pokemons.find((pokemon) => pokemon.id === id);
    if (!pokemon) {
      throw new NotFoundException(`El Pokemon con el id: ${id}, no existe`);
    }
    return pokemon;
  }

  create(pokemon: CreatePokemonDto): Pokemon {
    const newPokemon: Pokemon = { id: this.pokemons.length + 1, ...pokemon };
    this.pokemons.push(newPokemon);
    return newPokemon;
  }

  delete(id: number): void {
    const index = this.pokemons.findIndex((pokemon) => pokemon.id === id);
    if (index === -1) {
      throw new NotFoundException(`El Pokemon con el id: ${id}, no existe`);
    }
    this.pokemons.splice(index, 1);
  }

  update(id: number, pokemon: UpdatePokemonDto): Pokemon {
    const index = this.pokemons.findIndex((pokemon) => pokemon.id === id);
    if (index === -1) {
      throw new NotFoundException(`El Pokemon con el id: ${id}, no existe`);
    }
    this.pokemons[index] = { ...this.pokemons[index], ...pokemon };
    return this.pokemons[index];
  }
}
