import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    schema: 'src/infrastructure/database/prisma/schema.prisma',
    migrations: {
        path: 'src/infrastructure/database/prisma/migrations',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
});
