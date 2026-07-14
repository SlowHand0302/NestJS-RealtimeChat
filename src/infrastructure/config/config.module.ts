import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';
import { configSchema } from './joi.schema';
import { postgreSqlConfig } from './postgreSql.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
            cache: true,
            expandVariables: true,
            validationSchema: configSchema,
            validationOptions: {
                abortEarly: true,
            },
            load: [appConfig, jwtConfig, postgreSqlConfig],
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}
