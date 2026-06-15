import * as Joi from 'joi';

export const configSchema = Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    NODE_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
    BCRYPT_SALT_ROUNDS: Joi.number().default(12),
});
