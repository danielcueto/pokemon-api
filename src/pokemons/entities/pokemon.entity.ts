import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Type } from '../../types/entities/type.entity';
import { Trainer } from '../../trainers/entities/trainer.entity';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  level: number;

  @ManyToOne(() => Type, (type) => type.pokemons, { nullable: false })
  @JoinColumn({ name: 'typeId' })
  type: Type;

  @ManyToOne(() => Trainer, (trainer) => trainer.pokemons, { nullable: true })
  @JoinColumn({ name: 'trainerId' })
  trainer: Trainer | null;

  @Column({ type: 'int' })
  attack: number;

  @Column({ type: 'int' })
  defense: number;

  @Column({ type: 'int' })
  speed: number;

  @Column({ type: 'boolean' })
  isLegendary: boolean;

  @Column({ type: 'uuid', nullable: false })
  typeId: string;
}
