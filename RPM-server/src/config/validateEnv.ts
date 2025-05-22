import Joi from 'joi';

const envSchemas = Joi.object({
  PORT: Joi.string().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod'),
  API_PREFIX: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchemas.validate(process.env, { abortEarly: false });
if (error) {
  console.error(
    'Invalid environment configuration:\n',
    error.details.map((d) => d.message).join('\n'),
  );
  process.exit(1);
}

type EnvVars = {
  PORT: string;
  NODE_ENV: 'dev' | 'prod';
  API_PREFIX: string;
  JWT_SECRET: string;
};

export const validatedEnv = envVars as EnvVars;
