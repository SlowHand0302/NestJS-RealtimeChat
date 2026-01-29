import { BaseValueObject } from './_base.vo';

interface EntityIdProps{
    readonly value: string;
}

export class EntityIdVO extends BaseValueObject<EntityIdProps>{
    private constructor(props: EntityIdProps){
        super(props)
    }

    public static create(value: string): EntityIdVO {
        if (!value?.trim()) {
            throw new Error('Entity ID is required');
        }
        return new EntityIdVO({ value: value.trim() });
    }

    public static reconstitute(raw: string): EntityIdVO {
        if (!raw?.trim()) {
            throw new Error('Cannot reconstitute empty Entity ID');
        }
        return new EntityIdVO({ value: raw.trim() });
    }

    public static generate(): EntityIdVO {
        return EntityIdVO.create(crypto.randomUUID());
    }

    get value(): string {
        return this.props.value;
    }

    public equals(other: EntityIdVO | null | undefined): boolean {
        if (other == null) return false;
        return this.props.value === other.props.value;
    }
}