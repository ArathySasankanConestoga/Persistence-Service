import { DataSource } from "typeorm";
import { Photo } from "./photo/photo";
import { Video } from "./video/video";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Photo,Video],
  synchronize: true,
  logging: false,
});
