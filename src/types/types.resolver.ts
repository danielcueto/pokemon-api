import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TypesService } from './types.service';
import { Type } from './entities/type.entity';
import { CreateTypeInput, UpdateTypeInput } from './models/type.input';
import { Pokemon } from '../pokemons/entities/pokemon.entity';

@Resolver(() => Type)
export class TypesResolver {
  constructor(private readonly typesService: TypesService) {}

  @Query(() => [Type], { name: 'types' })
  async findAll() {
    return this.typesService.findAll();
  }

  @Query(() => Type, { name: 'type' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.typesService.findOne(id);
  }

  @Mutation(() => Type)
  async createType(@Args('createTypeInput') createTypeInput: CreateTypeInput) {
    return this.typesService.create(createTypeInput);
  }

  @Mutation(() => Type)
  async updateType(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTypeInput') updateTypeInput: UpdateTypeInput,
  ) {
    return this.typesService.update(id, updateTypeInput);
  }

  @Mutation(() => Boolean)
  async deleteType(@Args('id', { type: () => ID }) id: string) {
    await this.typesService.remove(id);
    return true;
  }

  @ResolveField(() => [Pokemon])
  async pokemons(@Parent() type: Type) {
    return this.typesService.getPokemonsByTypeId(type.id);
  }
}
