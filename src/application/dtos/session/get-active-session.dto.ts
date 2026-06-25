import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface GetActiveSessionDto extends UseCaseInput {
    userId: string;
}
