import { BaseValueObject } from './_base.vo';

interface EmailPropsVO {
    readonly value: string;
}

export class EmailVO extends BaseValueObject<EmailPropsVO> {
    private constructor(props: EmailPropsVO) {
        super(props);
    }

    public static create(value: string): EmailVO {
        if (!value || typeof value !== 'string') {
            throw new Error('Email must be a non-empty string');
        }

        const normalized = value.trim().toLowerCase();

        if (!EmailVO.isValidFormat(normalized)) {
            throw new Error('Invalid email format');
        }

        // You can add length or domain restrictions here if needed
        if (normalized.length > 254) {
            throw new Error('Email address is too long (max 254 characters)');
        }

        return new EmailVO({ value: normalized });
    }

    /**
     * Reconstitute from persistence / external source without extra validation.
     * Use this when loading from database (assuming data was already validated).
     */
    public static reconstitute(value: string): EmailVO {
        if (!value || typeof value !== 'string') {
            throw new Error('Email must be a non-empty string');
        }

        // Minimal sanitization — still normalize case
        const normalized = value.trim().toLowerCase();
        return new EmailVO({ value: normalized });
    }

    // ─── Validation logic ────────────────────────────────────────

    private static isValidFormat(email: string): boolean {
        // RFC 5322 is very complex → we use a practical, modern regex
        // This catches ~99% of real-world valid emails while rejecting obvious junk
        const emailRegex =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

        return emailRegex.test(email);
    }

    // ─── Behavior / Utils ────────────────────────────────────────

    public get value(): string {
        return this.props.value;
    }

    /**
     * Returns the local part (before @)
     */
    public get localPart(): string {
        return this.props.value.split('@')[0];
    }

    /**
     * Returns the domain part (after @)
     */
    public get domain(): string {
        return this.props.value.split('@')[1];
    }

    /**
     * Check if this email belongs to a specific domain
     */
    public isFromDomain(domain: string): boolean {
        return this.domain.toLowerCase() === domain.toLowerCase();
    }

    /**
     * Very basic disposable/temporary email check
     * (you can expand this list significantly in real projects)
     */
    public isProbablyDisposable(): boolean {
        const disposableDomains = [
            'mailinator.com',
            'tempmail.com',
            '10minutemail.com',
            'guerrillamail.com',
            'yopmail.com',
        ];

        return disposableDomains.some((d) => this.domain.endsWith(d));
    }

    public toJSON(): object {
        return {
            type: 'Email',
            value: this.props.value,
        };
    }
}
