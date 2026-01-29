import { BaseValueObject } from "./_base.vo";

interface EmailProps {
    readonly value: string;
}

export class EmailVO extends BaseValueObject<EmailProps>{
    private constructor(props: EmailProps){
        super(props);
    }

    public static create(value: string): EmailVO {
        this.validate(value);
        const email = new EmailVO({value});
        return email;
    }

    public static reconstitute(raw: EmailProps | string): EmailVO{
        const value = typeof raw === 'string' ? raw : raw.value;
        const normalized = value.trim().toLowerCase();
        if (!normalized.includes('@')) {
            throw new Error('Corrupted email data in persistence');
        }
        return new EmailVO({ value: normalized });
    }

    private static validate(value: string): void {
        if (!value?.trim()) {
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
        return this.props.value;
    }
}