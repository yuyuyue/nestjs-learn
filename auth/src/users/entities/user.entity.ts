import { Role } from 'src/iam/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiKeys } from '../../iam/entities/api-keys.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column({
    default: '新用户',
  })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  role: Role[];

  @JoinTable()
  @OneToMany(() => ApiKeys, (apiKeys) => apiKeys.user)
  apiKeys: ApiKeys[];
}
