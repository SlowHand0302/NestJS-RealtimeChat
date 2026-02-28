import * as bcrypt from 'bcrypt';
import { BaseValueObject } from './_base.vo';

interface HashedPasswordProps {
    readonly hash: string;
}

export class PasswordVO extends BaseValueObject<HashedPasswordProps> {
    private static readonly BCRYPT_COST = 13;

    private constructor(props: HashedPasswordProps) {
        super(props);
    }

    public static async create(plainPassword: string): Promise<PasswordVO> {
        this.validatePlainPassword(plainPassword);
        const hash = await bcrypt.hash(plainPassword, PasswordVO.BCRYPT_COST);
        return new PasswordVO({ hash });
    }

    public static reconstitute(hash: string): PasswordVO {
        if (!hash) {
            throw new Error('Password hash is required');
        }
        return new PasswordVO({ hash });
    }

    private static validatePlainPassword(plainPassword: string): void {
        if (!plainPassword) {
            throw new Error('Plain password is required');
        }

        if (plainPassword.length < 8) {
            throw new Error('Plain password must be at least 8 characters');
        }

        if (plainPassword.length > 128) {
            throw new Error('Plain password is too long');
        }

        // Business rule: plain password strength
        const hasUpperCase = /[A-Z]/.test(plainPassword);
        const hasLowerCase = /[a-z]/.test(plainPassword);
        const hasNumber = /[0-9]/.test(plainPassword);
        const hasSpecialChar = /[!@#$%^&*]/.test(plainPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new Error('Plain password must contain uppercase, lowercase, number, and special character');
        }
    }

    public async verify(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.props.hash);
    }

    // Convenience getters
    public get hash(): string {
        return this.props.hash;
    }

    // Prevents accidental logging of plain text (defensive)
    public toJSON(): object {
        return {
            type: 'Password',
            hash: '[REDACTED]',
        };
    }
}
