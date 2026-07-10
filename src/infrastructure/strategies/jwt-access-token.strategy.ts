import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload } from '@core/interfaces/token-service.interface';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }
    async validate(payload: AccessTokenPayload): Promise<AuthenticatedPrincipal> {
        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException('Malformed access token');
        }
        // roles & permissions forwarded to the route handler
        return {
            id: payload.sub,
            email: payload.email,
            sessionId: payload.sessionId,
            roles: Object.freeze([...(payload.roles ?? [])]),
            permissions: Object.freeze([...(payload.permissions ?? [])]),
        };
    }
}
