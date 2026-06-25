import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface SignOutDto extends UseCaseInput {
    sessionId: string;
}
