import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenPayload } from '@core/interfaces/token-service.interface';

export interface RefreshTokenRequest extends RefreshTokenPayload {
    refreshToken: string;
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            // Try HttpOnly cookie first, then Authorization header
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.['refresh_token'] ?? null,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: RefreshTokenPayload): Promise<RefreshTokenRequest> {
        if (!payload.sub || !payload.sessionId) {
            throw new UnauthorizedException('Malformed refresh token');
        }

        // Extract the raw token so the application layer can revoke it
        const refreshToken: string =
            req.cookies?.['refresh_token'] ?? ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? '';

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return { ...payload, refreshToken };
    }
}
