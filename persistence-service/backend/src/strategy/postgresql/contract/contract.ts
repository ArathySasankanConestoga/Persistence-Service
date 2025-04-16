import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
 
@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  contract_Id: number;
 
  @Column("int")
  staff_id: number;
 
  @Column("numeric")
  production_cost: number;
}