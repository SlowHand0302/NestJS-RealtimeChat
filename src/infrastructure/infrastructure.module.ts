import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CaslModule } from './casl/casl.module';
import { ConfigModule } from './config/config.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { DatabaseModule } from './database/database.module';
import { JWT_ACCESS_STRATEGY } from './config/passport.config';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { TOKEN_SERVICE } from '@core/interfaces/token-service.interface';
import { PASSWORD_HASHER } from '@core/interfaces/password-hasher.interface';
import { JwtTokenAdapter } from './adapters/authentication/jwt-token.adapter';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { REFRESH_TOKEN_HASHER } from '@core/interfaces/refresh-token-hasher.interface';
import { BcryptPasswordHasher } from './adapters/authentication/bcrypt-password.adapter';
import { BcryptRefreshTokenHasher } from './adapters/authentication/bcrypt-refresh-token.adapter';

@Module({
    imports: [
        CaslModule,
        ConfigModule,
        DatabaseModule,
        JwtModule.register({}),
        PassportModule.register({
            defaultStrategy: JWT_ACCESS_STRATEGY,
        }),
    ],
    providers: [
        JwtTokenAdapter,
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenAdapter,
        },
        {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },
        {
            provide: REFRESH_TOKEN_HASHER,
            useClass: BcryptRefreshTokenHasher,
        },
        JwtAccessTokenStrategy,
        JwtRefreshTokenStrategy,
        JwtAuthGuard,
        JwtRefreshTokenGuard,
    ],
    exports: [
        TOKEN_SERVICE,
        PASSWORD_HASHER,
        REFRESH_TOKEN_HASHER,
        JwtAuthGuard,
        PassportModule,
        JwtRefreshTokenGuard,
        JwtAccessTokenStrategy,
        JwtRefreshTokenStrategy,
    ],
})
export class InfrastructureModule {}
