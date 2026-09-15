import { Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { SessionManagerService } from '@core/services/session-manager.service';
import { RevokeAllSessionsOfUserDto } from '@application/dtos/session/revoke-all-session-of-user.dto';

@Injectable()
export default class RevokeAllSessionsOfUserUseCase extends BaseUseCase<RevokeAllSessionsOfUserDto, void> {
    constructor(private readonly sessionManager: SessionManagerService) {
        super();
    }

    async execute(input: RevokeAllSessionsOfUserDto): Promise<void> {
        await this.sessionManager.revokeAllUserSessions(IdentifierVO.reconstitute(input.userId));
    }
}
