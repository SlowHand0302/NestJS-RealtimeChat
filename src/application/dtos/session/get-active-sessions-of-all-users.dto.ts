import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface GetActiveSessionsOfAllUsersDto extends UseCaseInput {
    take?: number;
    skip?: number;
}
