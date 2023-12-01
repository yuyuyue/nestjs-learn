import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity('coffee') // sql table === coffee
export class Coffee {
  @PrimaryColumn({
    generated: true,
  })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @ManyToMany((type) => Flavor, (flavor) => flavor.coffee, {
    cascade: true, // 自动插入数据到flavor表
  })
  @JoinTable()
  flavors: Flavor[];
}
