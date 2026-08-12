import { Inject, Injectable } from '@nestjs/common';

import { User } from '@core/entities/user.entity';
import { Session } from '@core/entities/session.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import {
    SessionConcurrencyPolicyResolver,
    SESSION_CONCURRENCY_POLICY_RESOLVER,
} from '@core/policies/session-concurrency-policy-resolver.interface';
import { ConnectionInfoVO } from '@core/value-objects/connection-info.vo';
import { ITokenService, TOKEN_SERVICE } from '../interfaces/token-service.interface';
import { CONFIG_PROVIDER, IConfigProvider } from '@core/interfaces/config-provider.interface';
import { ISessionRepository, SESSION_REPOSITORY } from '@core/repositories/session.repository';
import { IRefreshTokenHasher, REFRESH_TOKEN_HASHER } from '@core/interfaces/refresh-token-hasher.interface';

@Injectable()
export class SessionManagerService {
    constructor(
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
        @Inject(CONFIG_PROVIDER)
        private readonly configService: IConfigProvider,
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(REFRESH_TOKEN_HASHER)
        private readonly refreshTokenHasher: IRefreshTokenHasher,
        @Inject(SESSION_CONCURRENCY_POLICY_RESOLVER)
        private readonly policyResolver: SessionConcurrencyPolicyResolver,
    ) {}

    async createSession(
        user: User,
        deviceId: IdentifierVO,
        connectionInfo: ConnectionInfoVO,
    ): Promise<{ session: Session; refreshToken: string }> {
        const activeSessions = await this.sessionRepository.findActiveSessionsByUserId(user.id);

        const policy = await this.policyResolver.resolvePolicyFor(user.id);
        const sessionIdsToRevoke = policy.resolve(
            activeSessions.map((s) => ({ sessionId: s.id.value, deviceId: s.deviceId })),
            deviceId.value,
        );

        for (const sessionId of sessionIdsToRevoke) {
            await this.sessionRepository.revokeById(IdentifierVO.reconstitute(sessionId));
        }

        const expiresAt = this.parseTtlToDate(this.configService.getRefreshTokenTtl());
        const session = Session.create(user.id, deviceId, expiresAt, connectionInfo);

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
        const expiresAt = this.parseTtlToDate(this.configService.getRefreshTokenTtl());
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
