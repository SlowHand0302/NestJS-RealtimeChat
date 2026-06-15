import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TOKEN_SERVICE } from '@core/interfaces/token-service.interface';
import { JwtTokenAdapter } from './adapters/authentication/jwt-token.adapter';

@Module({
    imports: [ConfigModule, DatabaseModule, JwtModule.register({})],
    providers: [
        JwtTokenAdapter,
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenAdapter,
        },
    ],
    exports: [TOKEN_SERVICE],
})
export class InfrastructureModule {}
