import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface RevokeSessionDto extends UseCaseInput {
    sessionId: string;
    userId: string;
}
