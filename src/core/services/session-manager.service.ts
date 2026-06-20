import { ConfigService } from '@nestjs/config';

import { User } from '@core/entities/user.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { DeviceInfoVO } from '@core/value-objects/device-info.vo';
import { ITokenService } from '../interfaces/token-service.interface';
import { ISessionRepository } from '@core/repositories/session.repository';
import { Session, SessionStrategyPropEnum } from '@core/entities/session.entity';
import { IRefreshTokenHasher } from '@core/interfaces/refresh-token-hasher.interface';

export class SessionManagerService {
    constructor(
        private readonly tokenService: ITokenService,
        private readonly configService: ConfigService,
        private readonly sessionRepository: ISessionRepository,
        private readonly refreshTokenHasher: IRefreshTokenHasher,
    ) {}

    async createSession(
        user: User,
        deviceInfo: DeviceInfoVO,
        strategy: SessionStrategyPropEnum,
    ): Promise<{ session: Session; refreshToken: string }> {
        // Single device: revoke all existing sessions
        if (strategy === SessionStrategyPropEnum.SINGLE_DEVICE) {
            await this.sessionRepository.revokeAllByUserId(user.id);
        }
        // Multi-device: check if device already has a session
        else {
            const existingSession = await this.sessionRepository.findByUserIdAndDeviceId(user.id, deviceInfo.deviceId);
            if (existingSession && existingSession.isValid()) {
                await this.sessionRepository.revokeById(existingSession.id);
            }
        }

        const expiresAt = this.parseTtlToDate(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'));
        const session = Session.create(user.id, expiresAt, deviceInfo);

        const refreshToken = await this.tokenService.generateRefreshToken({
            sub: user.id.value,
            sessionId: session.id.value,
        });

        const hashedRefreshToken = await this.refreshTokenHasher.hash(refreshToken);

        session.assignRefreshTokenHash(hashedRefreshToken);

        await this.sessionRepository.create(session);
        return { session: session, refreshToken };
    }

    async rotateSession(session: Session): Promise<{ session: Session; refreshToken: string }> {
        const expiresAt = this.parseTtlToDate(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'));
        const newRefreshToken = await this.tokenService.generateRefreshToken({
            sub: session.userId,
            sessionId: session.id.value,
        });

        const newRefreshTokenHash = await this.refreshTokenHasher.hash(newRefreshToken);

        session.rotate(newRefreshTokenHash, expiresAt);
        await this.sessionRepository.update(session.id, session);

        return { session: session, refreshToken: newRefreshToken };
    }

    async revokeSession(sessionId: IdentifierVO): Promise<void> {
        await this.sessionRepository.revokeById(sessionId);
    }

    async revokeAllUserSessions(userId: IdentifierVO): Promise<void> {
        await this.sessionRepository.revokeAllByUserId(userId);
    }

    async revokeOtherSessions(userId: IdentifierVO, currentSessionId: IdentifierVO): Promise<void> {
        await this.sessionRepository.revokeAllByUserIdExcept(userId, currentSessionId);
    }

    private parseTtlToDate(ttl: string): Date {
        const unit = ttl.slice(-1);
        const value = parseInt(ttl.slice(0, -1), 10);
        const ms =
            unit === 'd'
                ? value * 86400000
                : unit === 'h'
                  ? value * 3600000
                  : unit === 'm'
                    ? value * 60000
                    : unit === 's'
                      ? value * 1000
                      : 0;
        return new Date(Date.now() + ms);
    }
}
