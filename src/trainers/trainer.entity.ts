import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  second_name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'int' })
  badges: number;
}
