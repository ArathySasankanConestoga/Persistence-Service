import { DataSource } from "typeorm";
import { Photo } from "./photo/photo";
import { Video } from "./video/video";
import { Movie } from "./movie/movie";
import { Staff } from "./staff/staff";
import { Contract } from "./contract/contract";
import { Pstaff } from "./pstaff/pstaff";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Photo,Video,Movie,Staff,Contract,Pstaff],
  synchronize: true,
  logging: false,
});
