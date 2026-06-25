import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface GetCurrentUserDto extends UseCaseInput {
    userId: string;
}
