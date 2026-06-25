import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface RefreshTokenDto extends UseCaseInput {
    refreshToken: string;
}
