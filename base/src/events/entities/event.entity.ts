import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryColumn({
    generated: true,
  })
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, string>;
}
