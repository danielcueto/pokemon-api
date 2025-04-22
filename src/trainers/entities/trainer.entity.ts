import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  secondName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'int' })
  badges: number;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  pokemons: Pokemon[];
}
