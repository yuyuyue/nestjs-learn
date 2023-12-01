import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Coffee } from './coffee.entity';

@Entity('flavor')
export class Flavor {
  @PrimaryColumn({
    generated: true,
  })
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Coffee, (coffee) => coffee.flavors)
  coffee: Coffee[];
}
