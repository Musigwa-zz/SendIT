import dotEnv from 'dotenv';

dotEnv.config();
const dbEnv = {
  development: process.env.DATABASE_URL_DEV,
  test: process.env.DATABASE_URL_TEST,
  production: process.env.DATABASE_URL
};

export default { databaseUrl: dbEnv[process.env.NODE_ENV], dbEnv };
