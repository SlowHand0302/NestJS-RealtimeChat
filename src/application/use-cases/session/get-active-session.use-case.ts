import { Inject, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Device } from '@core/entities/device.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { GetActiveSessionDto } from '@application/dtos/session/get-active-session.dto';
import { ISessionRepository, SESSION_REPOSITORY } from '@core/repositories/session.repository';
import { IDeviceRepository, DEVICE_REPOSITORY } from '@core/repositories/device.repository';
import { GetActiveSessionResponseDto } from '@application/dtos/session/get-active-session.response';

const DEFAULT_TAKE = 20;
const DEFAULT_SKIP = 0;

@Injectable()
export class GetActiveSessionUseCase extends BaseUseCase<GetActiveSessionDto, GetActiveSessionResponseDto[]> {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(DEVICE_REPOSITORY)
        private readonly deviceRepository: IDeviceRepository,
    ) {
        super();
    }

    async execute(input: GetActiveSessionDto): Promise<GetActiveSessionResponseDto[]> {
        const userId = IdentifierVO.reconstitute(input.userId);

        const sessions = await this.sessionRepository.findActiveSessionsByUserIdPaginated(userId, {
            take: input.take ?? DEFAULT_TAKE,
            skip: input.skip ?? DEFAULT_SKIP,
            orderBy: { field: 'lastUsedAt', direction: 'desc' },
        });

        if (sessions.length === 0) {
            return [];
        }

        const deviceIds = [...new Set(sessions.map((s) => s.deviceId))].map((id) => IdentifierVO.reconstitute(id));

        const devices = await this.deviceRepository.findAll({
            take: deviceIds.length,
            skip: 0,
            orderBy: { field: 'lastSeenAt', direction: 'desc' },
            filter: { id: { operator: 'in', value: deviceIds } },
        });
        const deviceById = new Map<string, Device>(devices.map((d) => [d.id.value, d]));

        return sessions.map((session) => {
            const device = deviceById.get(session.deviceId);
            return {
                id: session.id.value,
                clientDeviceId: device?.clientDeviceId ?? null,
                deviceName: device?.deviceName ?? null,
                ipAddress: session.connectionInfo.ipAddress ?? null,
                userAgent: session.connectionInfo.userAgent ?? null,
                expiresAt: session.expiresAt,
                lastUsedAt: session.lastUsedAt,
                createdAt: session.createdAt,
            };
        });
    }
}
