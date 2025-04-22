import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
