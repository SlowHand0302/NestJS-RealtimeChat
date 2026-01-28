import { randomUUID } from 'crypto';

export class EntityIdVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error('User ID is required');
        }
        this._value = value;
    }

    static create(value?: string): EntityIdVO {
        return new EntityIdVO(value ?? randomUUID());
    }

    get value(): string {
        return this._value;
    }

    equals(other: EntityIdVO): boolean {
        if (!other) return false;
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}
