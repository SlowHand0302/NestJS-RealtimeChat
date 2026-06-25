import { UserStatusPropEnums } from '@core/entities/user.entity';
import { UseCaseOutput } from '@application/use-cases/_base.use-case';

export interface SignUpResponseDto extends UseCaseOutput {
    user: {
        id: string;
        email: string;
        emailVerified: boolean;
        status: UserStatusPropEnums;
    };
}
