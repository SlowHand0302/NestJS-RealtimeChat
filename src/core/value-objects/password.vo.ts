import * as bcrypt from 'bcrypt';

export class PasswordVO {
    private readonly _hash: string;

    private constructor(hash: string) {
        this._hash = hash;
    }

    static async create(plainPassword: string): Promise<PasswordVO> {
        this.validatePlainPassword(plainPassword);
        const hash = await bcrypt.hash(plainPassword, 10);
        return new PasswordVO(hash);
    }

    static fromHash(hash: string): PasswordVO {
        if (!hash) {
            throw new Error('Password hash is required');
        }
        return new PasswordVO(hash);
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

    async verify(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this._hash);
    }

    get hash(): string {
        return this._hash;
    }
}
