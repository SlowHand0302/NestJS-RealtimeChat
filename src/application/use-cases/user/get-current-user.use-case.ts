import { Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { IUserRepository } from '@core/repositories/user.repository';
import { GetCurrentUserDto } from '@application/dtos/user/get-current-user.dto';
import { GetCurrentUserUseCaseResponseDto } from '@application/dtos/user/get-current-user.response';

@Injectable()
export class GetCurrentUserUseCase extends BaseUseCase<GetCurrentUserDto, GetCurrentUserUseCaseResponseDto> {
    constructor(private readonly userRepository: IUserRepository) {
        super();
    }
    async execute(input: GetCurrentUserDto): Promise<GetCurrentUserUseCaseResponseDto> {
        const userId = IdentifierVO.reconstitute(input.userId);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return {
            id: user.id.value,
            email: user.email.value,
            emailVerified: user.emailVerified,
            status: user.status,
            roles: user.roles.map((role) => role.name),
        };
    }
}
