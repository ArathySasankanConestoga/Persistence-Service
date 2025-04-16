import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  movieName: string;

  @Column("date")
  releaseDate: Date;

  @Column("double precision")
  rating: number;

  @Column({
    length: 50,
  })
  genre: string;

  @Column("text")
  award: string;
}
