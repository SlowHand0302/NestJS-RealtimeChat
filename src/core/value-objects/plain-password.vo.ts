import { BaseValueObject } from './_base.vo';

interface PlainPasswordProps {
    value: string;
}

export class PlainPasswordVO extends BaseValueObject<PlainPasswordProps> {
    private constructor(props: PlainPasswordProps) {
        super(props);
    }

    public static create(plainPassword: string): PlainPasswordVO {
        this.validate(plainPassword);
        return new PlainPasswordVO({ value: plainPassword });
    }

    public get value(): string {
        return this.props.value;
    }

    private static validate(plainPassword: string): void {
        if (!plainPassword || plainPassword.trim().length === 0) {
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
}
