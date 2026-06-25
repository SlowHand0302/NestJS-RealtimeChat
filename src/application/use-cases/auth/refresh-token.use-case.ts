import { Injectable, UnauthorizedException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { IUserRepository } from '@core/repositories/user.repository';
import { ITokenService } from '@core/interfaces/token-service.interface';
import { RefreshTokenDto } from '@application/dtos/auth/refresh-token.dto';
import { ISessionRepository } from '@core/repositories/session.repository';
import { SessionManagerService } from '@core/services/session-manager.service';
import { IRefreshTokenHasher } from '@core/interfaces/refresh-token-hasher.interface';
import { RefreshTokenResponseDto } from '@application/dtos/auth/refresh-token.response';

@Injectable()
export class RefreshTokenUseCase extends BaseUseCase<RefreshTokenDto, RefreshTokenResponseDto> {
    constructor(
        private readonly tokenService: ITokenService,
        private readonly userRepository: IUserRepository,
        private readonly sessionManager: SessionManagerService,
        private readonly sessionRepository: ISessionRepository,
        private readonly refreshTokenHasher: IRefreshTokenHasher,
    ) {
        super();
    }

    async execute(input: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        const payload = await this.tokenService.verifyRefreshToken(input.refreshToken);
        const sessionId = payload.sessionId;
        if (!sessionId) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const session = await this.sessionRepository.findById(IdentifierVO.reconstitute(sessionId));
        if (!session || !session.isValid()) {
            throw new UnauthorizedException('Session expired or revoked');
        }

        const isValidToken = await this.refreshTokenHasher.compare(input.refreshToken, session.refreshTokenHash);
        if (!isValidToken) {
            await this.sessionRepository.revokeById(session.id);
            throw new UnauthorizedException('Invalid refresh token');
        }

        const { refreshToken: newRefreshToken } = await this.sessionManager.rotateSession(session);

        const user = await this.userRepository.findById(IdentifierVO.reconstitute(session.userId));
        if (!user) {
            throw new UnauthorizedException('User is no longer exist');
        }

        const accessToken = await this.tokenService.generateAccessToken({
            sub: user.id.value,
            email: user.email.value,
            roles: user.roles.map((role) => role.name),
            sessionId: session.id.value,
        });

        return {
            tokens: {
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            },
        };
    }
}
