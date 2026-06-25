import { UseCaseOutput } from '@application/use-cases/_base.use-case';
import { UserStatus } from '@infrastructure/database/prisma/generated/enums';

export interface SignInResponseDto extends UseCaseOutput {
    user: {
        id: string;
        email: string;
        emailVerified: boolean;
        status: UserStatus;
        roles: string[];
    };

    tokens: {
        accessToken: string;
        refreshToken: string;
    };

    session: {
        id: string;
        expiresAt: Date;
    };
}
