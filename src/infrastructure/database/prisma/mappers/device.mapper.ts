import { Device as PrismaDevice } from '../generated/client';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { Device as DeviceEntity } from '@core/entities/device.entity';
import { DeviceIdentityVO } from '@core/value-objects/device-identity.vo';

export class DeviceMapper {
    static toDomain(prisma: PrismaDevice): DeviceEntity {
        const identity = DeviceIdentityVO.reconstitute({
            clientDeviceId: prisma.clientDeviceId,
            deviceName: prisma.deviceName,
        });
        return DeviceEntity.reconstitute(
            {
                userId: IdentifierVO.reconstitute(prisma.userId),
                identity: identity,
                firstSeenAt: prisma.firstSeenAt,
                lastSeenAt: prisma.lastSeenAt,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
            },
        );
    }

    static toPersistence(device: DeviceEntity) {
        return {
            id: device.id.value,
            userId: device.userId,
            clientDeviceId: device.clientDeviceId,
            deviceName: device.deviceName,
            firstSeenAt: device.firstSeenAt,
            lastSeenAt: device.lastSeenAt,
        };
    }
}
