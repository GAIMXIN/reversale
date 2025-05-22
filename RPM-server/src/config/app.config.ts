import { validatedEnv } from './validateEnv';

const appConfig = {
  PORT: validatedEnv.PORT,
  NODE_ENV: validatedEnv.NODE_ENV,
  API_PREFIX: validatedEnv.API_PREFIX,
  JWT_SECRET: validatedEnv.JWT_SECRET,
};

export default appConfig;
