import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Type } from '../../types/entities/type.entity';
import { Trainer } from '../../trainers/entities/trainer.entity';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  level: number;

  @Field(() => Type)
  @ManyToOne(() => Type, (type) => type.pokemons, { nullable: false })
  @JoinColumn({ name: 'typeId' })
  type: Type;

  @ManyToOne(() => Trainer, (trainer) => trainer.pokemons, { nullable: true })
  @JoinColumn({ name: 'trainerId' })
  @Field(() => Trainer, { nullable: true })
  trainer: Trainer | null;

  @Field(() => Int)
  @Column({ type: 'int' })
  attack: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  defense: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  speed: number;

  @Field()
  @Column({ type: 'boolean' })
  isLegendary: boolean;

  @Column({ type: 'uuid', nullable: false })
  typeId: string;
}
