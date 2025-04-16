import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  staffId: number;

  @Column({
    length: 100,
  })
  staffName: string;

  @Column({ type: "int" })
  unionId: number;

  @Column({ type: "date" })
  dateOfBirth: Date;

  @Column({ type: "numeric" })
  phoneNumber: number;

  @Column({
    length: 50,
  })
  nationality: string;

  @Column({
    length: 25,
  })
  email: string;

  @Column({
    length: 50,
  })
  staff_role: string;

  @Column({
    length: 50,
  })
  biography_name: string;
}
