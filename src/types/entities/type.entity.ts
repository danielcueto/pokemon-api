import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
