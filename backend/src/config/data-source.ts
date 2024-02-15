import "reflect-metadata";
import { DataSource } from "typeorm";
import { Student } from "../entity/student";
import * as dotenv from "dotenv";
import { User } from "../entity/user";
dotenv.config();

export const AppDataSource = new DataSource({
  url: process.env.PG_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  type: "postgres",
  synchronize: false,
  logging: false,
  entities: [Student, User],
  migrations: [],
  subscribers: [],
});

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.HOST,
//   port: 5432,
//   username: process.env.PG_USERNAME,
//   password: process.env.PASSWORD ,
//   database: process.env.DATABASE,
//   entities: [Student, User],
//   synchronize: false,
//   logging: true,
// });
