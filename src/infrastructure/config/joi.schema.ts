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
    AUTH_COOKIE_SECURE: Joi.boolean().default(false),
    AUTH_COOKIE_SAME_SITE: Joi.string().valid('strict', 'lax', 'none').default('lax'),
    AUTH_COOKIE_DOMAIN: Joi.string().allow('').optional(),
});
