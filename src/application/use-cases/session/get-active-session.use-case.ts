import { Inject, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Device } from '@core/entities/device.entity';
import {
    GetActiveSessionResponseDto,
    GetActiveSessionPaginatedResponseDto,
} from '@application/dtos/session/get-active-session.response';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { GetActiveSessionDto } from '@application/dtos/session/get-active-session.dto';
import { ISessionRepository, SESSION_REPOSITORY } from '@core/repositories/session.repository';
import { IDeviceRepository, DEVICE_REPOSITORY } from '@core/repositories/device.repository';

const DEFAULT_TAKE = 20;
const DEFAULT_SKIP = 0;

@Injectable()
export default class GetActiveSessionUseCase extends BaseUseCase<
    GetActiveSessionDto,
    GetActiveSessionPaginatedResponseDto
> {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(DEVICE_REPOSITORY)
        private readonly deviceRepository: IDeviceRepository,
    ) {
        super();
    }

    async execute(input: GetActiveSessionDto): Promise<GetActiveSessionPaginatedResponseDto> {
        const userId = IdentifierVO.reconstitute(input.userId);
        const now = new Date();

        const activeCondition = {
            userId: { operator: 'equals' as const, value: userId.value },
            isRevoked: { operator: 'equals' as const, value: false },
            expiresAt: { operator: 'gt' as const, value: now },
        };

        const [sessions, total] = await Promise.all([
            this.sessionRepository.findActiveSessionsByUserIdPaginated(userId, {
                take: input.take ?? DEFAULT_TAKE,
                skip: input.skip ?? DEFAULT_SKIP,
                orderBy: { field: 'lastUsedAt', direction: 'desc' },
            }),
            this.sessionRepository.count(activeCondition),
        ]);

        if (sessions.length === 0) {
            return { items: [], total };
        }

        const deviceIds = [...new Set(sessions.map((s) => s.deviceId))].map((id) => IdentifierVO.reconstitute(id));

        const devices = await this.deviceRepository.findAll({
            take: deviceIds.length,
            skip: 0,
            orderBy: { field: 'lastSeenAt', direction: 'desc' },
            filter: { id: { operator: 'in', value: deviceIds } },
        });
        const deviceById = new Map<string, Device>(devices.map((d) => [d.id.value, d]));

        const items: GetActiveSessionResponseDto[] = sessions.map((session) => {
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

        return { items, total };
    }
}
