import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { SessionManagerService } from '@core/services/session-manager.service';
import { SignOutAllSessionDto } from '@application/dtos/auth/sign-out-all-session.dto';

@Injectable()
export class SignOutAllUseCase extends BaseUseCase<SignOutAllSessionDto, void> {
    constructor(private readonly sessionManager: SessionManagerService) {
        super();
    }

    async execute(input: SignOutAllSessionDto): Promise<void> {
        const userId = input.userId;
        await this.sessionManager.revokeAllUserSessions(IdentifierVO.reconstitute(userId));
    }
}
