import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'int' })
  typeId: number;

  @Column({ type: 'int' })
  trainerId: number;

  @Column({ type: 'int' })
  attack: number;

  @Column({ type: 'int' })
  defense: number;

  @Column({ type: 'int' })
  speed: number;

  @Column({ type: 'boolean' })
  isLegendary: boolean;
}
