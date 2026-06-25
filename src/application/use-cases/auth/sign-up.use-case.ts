import { ConflictException, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { EmailVO } from '@core/value-objects/email.vo';
import { SignUpDto } from '@application/dtos/auth/sign-up.dto';
import { User as UserEntity } from '@core/entities/user.entity';
import { IUserRepository } from '@core/repositories/user.repository';
import { PlainPasswordVO } from '@core/value-objects/plain-password.vo';
import { SignUpResponseDto } from '@application/dtos/auth/sign-up.response';
import { IPasswordHasher } from '@core/interfaces/password-hasher.interface';

@Injectable()
export default class SignUpUseCase extends BaseUseCase<SignUpDto, SignUpResponseDto> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
    ) {
        super();
    }

    async execute(input: SignUpDto): Promise<SignUpResponseDto> {
        const email = EmailVO.create(input.email);
        const exists = await this.userRepository.findByEmail(email);
        if (exists) {
            throw new ConflictException('Email already registered');
        }

        const plainPassword = PlainPasswordVO.create(input.password);
        const hashedPassword = await this.passwordHasher.hash(plainPassword);

        const user = UserEntity.create(email, hashedPassword);
        await this.userRepository.save(user);

        return {
            user: {
                id: user.id.value,
                email: user.email.value,
                emailVerified: user.emailVerified,
                status: user.status,
            },
        };
    }
}
