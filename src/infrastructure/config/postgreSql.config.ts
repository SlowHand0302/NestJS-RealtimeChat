import { registerAs } from '@nestjs/config';

export interface PostgreSqlConfig {
    url: string;
}

export const postgreSqlConfig = registerAs<PostgreSqlConfig>('postgreSql', () => {
    return {
        url: process.env.DATABASE_URL,
    };
});
