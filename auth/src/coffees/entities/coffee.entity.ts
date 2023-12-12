import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;
}
