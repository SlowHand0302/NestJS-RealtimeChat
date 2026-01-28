export class EmailVO {
    private readonly _value: string;

    constructor(value: string) {
        this.validate(value);
        this._value = value.toLowerCase().trim();
    }

    private validate(value: string): void {
        if (!value) {
            throw new Error('Email is required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new Error('Invalid email format');
        }

        if (value.length > 255) {
            throw new Error('Email is too long');
        }
    }

    get value(): string {
        return this._value;
    }

    equals(other: EmailVO): boolean {
        return this._value === other._value;
    }
}
