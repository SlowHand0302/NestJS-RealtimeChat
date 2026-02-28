import { BaseValueObject } from './_base.vo';

interface IdentifierProps {
    readonly value: string;
}

export class IdentifierVO extends BaseValueObject<IdentifierProps> {
    private constructor(props: IdentifierProps) {
        super(props);
    }

    public static create(): IdentifierVO {
        const value = crypto.randomUUID();
        return new IdentifierVO({ value: value });
    }

    public static reconstitute(value: string): IdentifierVO {
        if (!value || typeof value !== 'string') {
            throw new Error('Identifier value must be a non-empty string');
        }

        if (!this.isValidUuid(value)) {
            throw new Error('Invalid identifier format — expected valid UUID');
        }

        return new IdentifierVO({ value });
    }

    /**
     * Alternative: create from a custom format (e.g. prefix + number)
     * Only use when the domain really requires non-UUID identifiers.
     */
    public static reconstituteFromCustom(value: string, validator?: (v: string) => boolean): IdentifierVO {
        if (!value || typeof value !== 'string') {
            throw new Error('Identifier value must be a non-empty string');
        }

        if (validator && !validator(value)) {
            throw new Error(`Invalid custom identifier format: ${value}`);
        }

        return new IdentifierVO({ value });
    }

    private static isValidUuid(uuid: string): boolean {
        // Regex to check for correct format and version/variant bits
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (typeof uuid !== 'string') {
            return false;
        }

        return uuidV4Regex.test(uuid);
    }

    public get value(): string {
        return this.props.value;
    }

    public toJSON(): object {
        return {
            type: this.constructor.name,
            value: this.props.value,
        };
    }
}
