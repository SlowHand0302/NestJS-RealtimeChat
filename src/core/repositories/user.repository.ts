import { User } from '@core/entities/user.entity';
import { IBaseRepository } from './_base.repository';
import { EmailVO } from '@core/value-objects/email.vo';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: EmailVO): Promise<User | null>;
    existsByEmail(email: EmailVO): Promise<boolean>;
}
