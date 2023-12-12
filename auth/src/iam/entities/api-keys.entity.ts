import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ApiKeys {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  key: string;

  @Column()
  uuid: string;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;
}
