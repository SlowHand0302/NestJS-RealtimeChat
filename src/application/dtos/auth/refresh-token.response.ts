import { UseCaseOutput } from '@application/use-cases/_base.use-case';

export interface RefreshTokenResponseDto extends UseCaseOutput {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
