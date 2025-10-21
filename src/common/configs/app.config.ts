import { registerAs } from '@nestjs/config';

export interface AppConfig {
    host?: string;
    port?: string;
    environment?: string;
}

export const appConfig = registerAs<AppConfig>('app', () => ({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '3000',
    environment: process.env.ENVIRONMENT || 'development',
}));
