import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface RevokeAllSessionsOfUserDto extends UseCaseInput {
    userId: string;
}
