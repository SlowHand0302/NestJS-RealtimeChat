import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenService, AccessTokenPayload, RefreshTokenPayload } from '@core/interfaces/token-service.interface';

@Injectable()
export class JwtTokenAdapter implements ITokenService {
    private readonly accessTokenSecret: string;
    private readonly accessTokenExpiresIn: JwtSignOptions['expiresIn'];
    private readonly refreshTokenSecret: string;
    private readonly refreshTokenExpiresIn: JwtSignOptions['expiresIn'];

    constructor(
        private readonly jwtService: JwtService,
        configService: ConfigService,
    ) {
        this.accessTokenSecret = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
        this.accessTokenExpiresIn = configService.get(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
            '15m',
        ) as JwtSignOptions['expiresIn'];
        this.refreshTokenSecret = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
        this.refreshTokenExpiresIn = configService.get(
            'JWT_REFRESH_TOKEN_EXPIRES_IN',
            '7d',
        ) as JwtSignOptions['expiresIn'];
    }

    async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.accessTokenSecret,
            expiresIn: this.accessTokenExpiresIn,
        });
    }

    async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.refreshTokenSecret,
            expiresIn: this.refreshTokenExpiresIn,
        });
    }

    async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
                secret: this.accessTokenSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
                secret: this.refreshTokenSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
