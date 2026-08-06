import { Session as PrismaSession } from '../generated/client';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { Session as SessionEntity } from '@core/entities/session.entity';
import { ConnectionInfoVO } from '@core/value-objects/connection-info.vo';

export class SessionMapper {
    static toDomain(prisma: PrismaSession): SessionEntity {
        const connectionInfo = ConnectionInfoVO.reconstitute({
            ipAddress: prisma.ipAddress,
            userAgent: prisma.userAgent,
        });
        return SessionEntity.reconstitute(
            {
                userId: IdentifierVO.reconstitute(prisma.userId),
                deviceId: IdentifierVO.reconstitute(prisma.deviceId),
                refreshTokenHash: prisma.refreshTokenHash,
                connectionInfo: connectionInfo,
                isRevoked: prisma.isRevoked ?? false,
                expireAt: prisma.expiresAt,
                lastUsedAt: prisma.lastUsedAt,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
            },
        );
    }

    static toPersistence(session: SessionEntity) {
        return {
            id: session.id.value,
            userId: session.userId,
            deviceId: session.deviceId,
            refreshTokenHash: session.refreshTokenHash,
            ipAddress: session.connectionInfo.ipAddress,
            userAgent: session.connectionInfo.userAgent,
            isRevoked: session.isRevoked,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
            lastUsedAt: session.lastUsedAt,
        };
    }
}
