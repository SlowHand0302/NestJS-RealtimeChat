import { UseCaseOutput } from '@application/use-cases/_base.use-case';

export interface GetCurrentUserUseCaseResponseDto extends UseCaseOutput {
    id: string;
    email: string;
    emailVerified: boolean;
    status: string;
    roles: string[];
}
