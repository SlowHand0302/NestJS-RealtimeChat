import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { EmailVO } from '@core/value-objects/email.vo';
import { SignInDto } from '@application/dtos/auth/sign-in.dto';
import { PlainPasswordVO } from '@core/value-objects/plain-password.vo';
import { ConnectionInfoVO } from '@core/value-objects/connection-info.vo';
import { SignInResponseDto } from '@application/dtos/auth/sign-in.response';
import { DeviceManagerService } from '@core/services/device-manager.service';
import { SessionManagerService } from '@core/services/session-manager.service';
import { IUserRepository, USER_REPOSITORY } from '@core/repositories/user.repository';
import { ITokenService, TOKEN_SERVICE } from '@core/interfaces/token-service.interface';
import { IPasswordHasher, PASSWORD_HASHER } from '@core/interfaces/password-hasher.interface';

@Injectable()
export default class SignInUseCase extends BaseUseCase<SignInDto, SignInResponseDto> {
    constructor(
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
        private readonly deviceManager: DeviceManagerService,
        private readonly sessionManager: SessionManagerService,
    ) {
        super();
    }

    async execute(input: SignInDto): Promise<SignInResponseDto> {
        const email = EmailVO.create(input.email);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Not Found Account');
        }

        const plainPassword = PlainPasswordVO.create(input.password);
        const isPasswordValid = await this.passwordHasher.compare(plainPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong Password');
        }

        const { device } = await this.deviceManager.resolveDevice(user.id, input.clientDeviceId, input.deviceName);
        // TODO: when isNew is true, this is the user's first sign-in from this
        // device. Hook in a "new device login" alert (email/notification) here
        // once that feature is built — currently backlog.

        const connectionInfo = ConnectionInfoVO.create({
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
        });

        const { session, refreshToken } = await this.sessionManager.createSession(user, device.id, connectionInfo);

        const accessToken = await this.tokenService.generateAccessToken({
            sub: user.id.value,
            email: user.email.value,
            roles: user.roles.map((role) => role.name),
            sessionId: session.id.value,
        });

        return {
            user: {
                id: user.id.value,
                email: user.email.value,
                emailVerified: user.emailVerified,
                status: user.status,
                roles: user.roles.map((role) => role.name),
            },
            tokens: {
                accessToken,
                refreshToken,
            },
            session: {
                id: session.id.value,
                expiresAt: session.expiresAt,
            },
        };
    }
}
