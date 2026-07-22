import { PlainPasswordVO } from '@core/value-objects/plain-password.vo';
import { HashedPasswordVO } from '@core/value-objects/hashed-password.vo';

export const PASSWORD_HASHER = Symbol('IPasswordHasher');

export interface IPasswordHasher {
    hash(plainPassword: PlainPasswordVO): Promise<HashedPasswordVO>;
    compare(plainPassword: PlainPasswordVO, hashedPassword: HashedPasswordVO): Promise<boolean>;
}
