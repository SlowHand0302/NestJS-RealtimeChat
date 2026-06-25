import { Injectable, UnauthorizedException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { SignOutDto } from '@application/dtos/auth/sign-out.dto';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { ISessionRepository } from '@core/repositories/session.repository';

@Injectable()
export class SignOutUseCase extends BaseUseCase<SignOutDto, void> {
    constructor(private readonly sessionRepository: ISessionRepository) {
        super();
    }
    async execute(input: SignOutDto): Promise<void> {
        const sessionId = IdentifierVO.reconstitute(input.sessionId);
        const session = await this.sessionRepository.findById(sessionId);
        if (!sessionId) {
            throw new UnauthorizedException('Session Not Found');
        }
        session.revoke();
        await this.sessionRepository.update(session.id, session);
    }
}
