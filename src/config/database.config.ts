import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Admin123',
  database: 'NestAngularCartonDemo',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
