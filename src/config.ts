import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const config = Object.freeze({
  debug_logging: process.env.NODE_ENV === 'development',
  jwt_secret: process.env.JWT_SECRET || '',
  port: process.env.PORT || 3000,

  db: Object.freeze({
    host: process.env.DB__HOST,
    port: parseInt(process.env.DB__PORT || '5432', 10),
    username: process.env.DB__USERNAME,
    password: process.env.DB__PASSWORD,
    database: process.env.DB__DATABASE,
  }),
});
