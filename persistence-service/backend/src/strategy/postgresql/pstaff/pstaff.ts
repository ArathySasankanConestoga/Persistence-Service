import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Pstaff {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  staff_Id: number;
 
  @Column({ type: 'varchar', length: 50 })
  production_role: string;
 
  @Column()
  movie_Id: number;
}