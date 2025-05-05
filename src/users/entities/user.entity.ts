import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User {
  @Column({ type: 'varchar', primary: true, nullable: false, unique: true })
  username: string;
  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;
}
