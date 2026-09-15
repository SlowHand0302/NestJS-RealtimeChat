import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { RevokeSessionDto } from '@application/dtos/session/revoke-session.dto';
import { ISessionRepository, SESSION_REPOSITORY } from '@core/repositories/session.repository';

@Injectable()
export default class RevokeSessionUseCase extends BaseUseCase<RevokeSessionDto, void> {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) {
        super();
    }

    async execute(input: RevokeSessionDto): Promise<void> {
        const sessionId = IdentifierVO.reconstitute(input.sessionId);
        const session = await this.sessionRepository.findById(sessionId);
        if (!session || session.userId !== input.userId) {
            throw new UnauthorizedException('Session Not Found');
        }
        session.revoke();
        await this.sessionRepository.update(session.id, session);
    }
}
