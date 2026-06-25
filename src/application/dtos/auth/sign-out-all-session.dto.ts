import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface SignOutAllSessionDto extends UseCaseInput {
    userId: string;
}
