import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('types')
export class Type {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Field(() => [Pokemon], { nullable: true })
  @OneToMany(() => Pokemon, (pokemon) => pokemon.type)
  pokemons: Pokemon[];
}
