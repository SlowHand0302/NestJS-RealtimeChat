import { User } from '@core/entities/user.entity';
import { ITokenService } from './token.service.interface';
import { DeviceInfoVO } from '@core/value-objects/device-info.vo';
import { ISessionRepository } from '@core/repositories/session.repository';
import { Session, SessionStrategyPropEnum } from '@core/entities/session.entity';
import { EntityIdVO } from '@core/value-objects/entity-id.vo';

export class SessionManagerService {
    constructor(
        private readonly tokenService: ITokenService,
        private readonly sessionRepository: ISessionRepository,
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

        const refreshToken = this.tokenService.generateRefreshToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const session = Session.create(user.id, refreshToken, expiresAt, deviceInfo);

        const savedSession = await this.sessionRepository.save(session);
        return { session: savedSession, refreshToken };
    }

    async rotateSession(session: Session): Promise<{ session: Session; refreshToken: string }> {
        const newRefreshToken = this.tokenService.generateRefreshToken();
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        session.rotate(newRefreshToken, newExpiresAt);
        const updatedSession = await this.sessionRepository.save(session);

        return { session: updatedSession, refreshToken: newRefreshToken };
    }

    async revokeSession(sessionId: EntityIdVO): Promise<void> {
        await this.sessionRepository.revokeById(sessionId);
    }

    async revokeAllUserSessions(userId: EntityIdVO): Promise<void> {
        await this.sessionRepository.revokeAllByUserId(userId);
    }

    async revokeOtherSessions(userId: EntityIdVO, currentSessionId: EntityIdVO): Promise<void> {
        await this.sessionRepository.revokeAllByUserIdExcept(userId, currentSessionId);
    }
}
