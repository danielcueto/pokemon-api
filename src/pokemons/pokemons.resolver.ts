import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './entities/pokemon.entity';
import {
  CreatePokemonInput,
  UpdatePokemonInput,
  CapturePokemonInput,
} from './models/pokemon.input';

@Resolver(() => Pokemon)
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Query(() => [Pokemon], { name: 'pokemons' })
  async getAll() {
    return this.pokemonsService.getAll();
  }

  @Query(() => Pokemon, { name: 'pokemon' })
  async getById(@Args('id', { type: () => ID }) id: string) {
    return this.pokemonsService.getById(id);
  }

  @Mutation(() => Pokemon)
  async createPokemon(
    @Args('createPokemonInput') createPokemonInput: CreatePokemonInput,
  ) {
    return this.pokemonsService.create(createPokemonInput);
  }

  @Mutation(() => Pokemon)
  async updatePokemon(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePokemonInput') updatePokemonInput: UpdatePokemonInput,
  ) {
    return this.pokemonsService.update(id, updatePokemonInput);
  }

  @Mutation(() => Boolean)
  async deletePokemon(@Args('id', { type: () => ID }) id: string) {
    await this.pokemonsService.delete(id);
    return true;
  }

  @Mutation(() => Pokemon)
  async capturePokemon(
    @Args('id', { type: () => ID }) id: string,
    @Args('capturePokemonInput') capturePokemonInput: CapturePokemonInput,
  ) {
    return this.pokemonsService.capture(id, capturePokemonInput.trainerId);
  }

  @Mutation(() => Pokemon)
  async levelUpPokemon(@Args('id', { type: () => ID }) id: string) {
    return this.pokemonsService.levelUp(id);
  }

  @Mutation(() => Pokemon)
  async releasePokemon(@Args('id', { type: () => ID }) id: string) {
    return this.pokemonsService.release(id);
  }
}
