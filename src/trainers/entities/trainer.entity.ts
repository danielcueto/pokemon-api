import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('trainers')
export class Trainer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  secondName: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  age: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  badges: number;

  @Field(() => [Pokemon], { nullable: true })
  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  pokemons: Pokemon[];
}
