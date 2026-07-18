import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtConfig } from '@infrastructure/config/jwt.config';
import { CookieConfig } from '@infrastructure/config/cookie.config';
import { JWT_REFRESH_STRATEGY } from '@infrastructure/config/passport.config';
import { RefreshTokenPayload } from '@core/interfaces/token-service.interface';
import { RefreshAuthenticatedPrincipal } from '@infrastructure/principals/refresh-authenticated.principal';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, JWT_REFRESH_STRATEGY) {
    private readonly cookieName: string;
    private readonly refreshTokenExtractor: (req: Request) => string | null;

    constructor(configService: ConfigService) {
        const jwtConfig = configService.getOrThrow<JwtConfig>('jwt');
        const cookieConfig = configService.getOrThrow<CookieConfig>('cookie');
        const refreshTokenExtractor = ExtractJwt.fromExtractors([
            (req: Request) => req?.cookies?.[cookieConfig.name] ?? null,
            ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]);

        super({
            // Try HttpOnly cookie first, then Authorization header
            jwtFromRequest: refreshTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: jwtConfig.refreshTokenSecret,
            passReqToCallback: true,
        });

        this.cookieName = cookieConfig.name;
        this.refreshTokenExtractor = refreshTokenExtractor;
    }

    async validate(req: Request, payload: RefreshTokenPayload): Promise<RefreshAuthenticatedPrincipal> {
        if (!payload.sub || !payload.sessionId) {
            throw new UnauthorizedException('Malformed refresh token');
        }

        // Extract the raw token so the application layer can revoke it
        const refreshToken: string = this.refreshTokenExtractor(req);
        console.log(this.cookieName);

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return {
            id: payload.sub,
            sessionId: payload.sessionId,
            refreshToken,
        };
    }
}
