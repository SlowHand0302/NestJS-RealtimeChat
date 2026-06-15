import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload } from '@core/interfaces/token-service.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }
    async validate(payload: AccessTokenPayload): Promise<AccessTokenPayload> {
        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException('Malformed access token');
        }
        return payload; // roles & permissions forwarded to the route handler
    }
}
