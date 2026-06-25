import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface SignUpDto extends UseCaseInput {
    email: string;
    password: string;
}
