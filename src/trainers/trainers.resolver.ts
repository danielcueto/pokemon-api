import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TrainersService } from './trainers.service';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerInput, UpdateTrainerInput } from './models/trainer.input';
import { Pokemon } from '../pokemons/entities/pokemon.entity';

@Resolver(() => Trainer)
export class TrainersResolver {
  constructor(private readonly trainersService: TrainersService) {}

  @Query(() => [Trainer], { name: 'trainers' })
  async getAll() {
    return this.trainersService.getAll();
  }

  @Query(() => Trainer, { name: 'trainer' })
  async getById(@Args('id', { type: () => ID }) id: string) {
    return this.trainersService.getById(id);
  }

  @Mutation(() => Trainer)
  async createTrainer(
    @Args('createTrainerInput') createTrainerInput: CreateTrainerInput,
  ) {
    return this.trainersService.create(createTrainerInput);
  }

  @Mutation(() => Trainer)
  async updateTrainer(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTrainerInput') updateTrainerInput: UpdateTrainerInput,
  ) {
    return this.trainersService.update(id, updateTrainerInput);
  }

  @Mutation(() => Boolean)
  async deleteTrainer(@Args('id', { type: () => ID }) id: string) {
    await this.trainersService.delete(id);
    return true;
  }

  @ResolveField(() => [Pokemon])
  async pokemons(@Parent() trainer: Trainer) {
    const { id } = trainer;
    return this.trainersService.getPokemonsByTrainerId(id);
  }
}
