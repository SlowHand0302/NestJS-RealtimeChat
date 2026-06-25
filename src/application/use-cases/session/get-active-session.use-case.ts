import { Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { ISessionRepository } from '@core/repositories/session.repository';
import { GetActiveSessionDto } from '@application/dtos/session/get-active-session.dto';
import { GetActiveSessionResponseDto } from '@application/dtos/session/get-active-session.response';

@Injectable()
export class GetActiveSessionUseCase extends BaseUseCase<GetActiveSessionDto, GetActiveSessionResponseDto[]> {
    constructor(private readonly sessionRepository: ISessionRepository) {
        super();
    }
    async execute(input: GetActiveSessionDto): Promise<GetActiveSessionResponseDto[]> {
        const sessions = await this.sessionRepository.findActiveSessionsByUserId(
            IdentifierVO.reconstitute(input.userId),
        );

        return sessions.map((session) => ({
            id: session.id.value,
            deviceId: session.deviceInfo.deviceId,
            deviceName: session.deviceInfo.deviceName ?? null,
            ipAddress: session.deviceInfo.ipAddress ?? null,
            userAgent: session.deviceInfo.userAgent ?? null,
            expiresAt: session.expiresAt,
            lastUsedAt: session.lastUsedAt,
            createdAt: session.createdAt,
        }));
    }
}
