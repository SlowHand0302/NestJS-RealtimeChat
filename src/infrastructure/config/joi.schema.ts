import * as Joi from 'joi';

export const configSchema = Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    NODE_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
});
