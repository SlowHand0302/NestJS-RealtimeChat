import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { DeviceInfoVO } from '@core/value-objects/device-info.vo';
import { Session as PrismaSession } from '../generated/client';
import { Session as SessionEntity } from '@core/entities/session.entity';

export class SessionMapper {
    static toDomain(prisma: PrismaSession): SessionEntity {
        const deviceInfo = DeviceInfoVO.reconstitute({
            deviceId: prisma.deviceId,
            deviceName: prisma.deviceName,
            ipAddress: prisma.ipAddress,
            userAgent: prisma.userAgent,
        });
        return SessionEntity.reconstitute(
            {
                userId: IdentifierVO.reconstitute(prisma.userId),
                refreshToken: prisma.refreshToken,
                deviceInfo: deviceInfo,
                isRevoke: prisma.isRevoked ?? false,
                expireAt: prisma.expiresAt,
                lastUsedAt: prisma.lastUsedAt,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
                deletedAt: prisma.deletedAt,
            },
        );
    }

    static toPersistence(session: SessionEntity) {
        return {
            id: session.id.value,
            userId: session.userId,
            refreshToken: session.refreshToken,
            deviceId: session.deviceInfo.deviceId,
            deviceName: session.deviceInfo.deviceName,
            ipAddress: session.deviceInfo.ipAddress,
            userAgent: session.deviceInfo.userAgent,
            isRevoked: session.isRevoked,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
            lastUsedAt: session.lastUsedAt,
        };
    }
}
