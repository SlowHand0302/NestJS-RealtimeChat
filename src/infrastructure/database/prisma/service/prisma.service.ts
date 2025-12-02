import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { PostgreSqlConfig } from '@infrastructure/config/postgreSql.config';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService: ConfigService) {
        const postgreSqlConfig = configService.get<PostgreSqlConfig>('postgreSql');
        const connectionString = postgreSqlConfig.url;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        super({
            adapter,
            log: ['error', 'info', 'query', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        try {
            await this.$queryRaw`SELECT 1`; // Dummy query to trigger pool init and logs
            console.log('✅ Prisma connected successfully!');
        } catch (error) {
            console.error('❌ Prisma connection failed:', error);
            throw error; // Let NestJS handle shutdown if failed
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
