import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pokemon } from '../../pokemons/entities/pokemon.entity';
@Entity('types')
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.type)
  pokemons: Pokemon[];
}
