import { Inject, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Device } from '@core/entities/device.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import {
    ActiveSessionWithUserResponseDto,
    GetActiveSessionsOfAllUsersPaginatedResponseDto,
} from '@application/dtos/session/get-active-sessions-of-all-users.response';
import { IDeviceRepository, DEVICE_REPOSITORY } from '@core/repositories/device.repository';
import { ISessionRepository, SESSION_REPOSITORY } from '@core/repositories/session.repository';
import { GetActiveSessionsOfAllUsersDto } from '@application/dtos/session/get-active-sessions-of-all-users.dto';

const DEFAULT_TAKE = 20;
const DEFAULT_SKIP = 0;

@Injectable()
export default class GetActiveSessionsOfAllUsersUseCase extends BaseUseCase<
    GetActiveSessionsOfAllUsersDto,
    GetActiveSessionsOfAllUsersPaginatedResponseDto
> {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(DEVICE_REPOSITORY)
        private readonly deviceRepository: IDeviceRepository,
    ) {
        super();
    }

    async execute(input: GetActiveSessionsOfAllUsersDto): Promise<GetActiveSessionsOfAllUsersPaginatedResponseDto> {
        const now = new Date();

        const activeCondition = {
            isRevoked: { operator: 'equals' as const, value: false },
            expiresAt: { operator: 'gt' as const, value: now },
        };

        const [sessions, total] = await Promise.all([
            this.sessionRepository.findAll({
                take: input.take ?? DEFAULT_TAKE,
                skip: input.skip ?? DEFAULT_SKIP,
                orderBy: { field: 'lastUsedAt', direction: 'desc' },
                filter: activeCondition,
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

        const items: ActiveSessionWithUserResponseDto[] = sessions.map((session) => {
            const device = deviceById.get(session.deviceId);
            return {
                id: session.id.value,
                userId: session.userId,
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
