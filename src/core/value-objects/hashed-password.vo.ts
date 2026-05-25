import { BaseValueObject } from './_base.vo';

interface HashedPasswordProps {
    value: string;
}

export class HashedPasswordVO extends BaseValueObject<HashedPasswordProps> {
    private constructor(props: HashedPasswordProps) {
        super(props);
    }

    public static create(hash: string): HashedPasswordVO {
        if (!hash) {
            throw new Error('Password hash is required');
        }

        return new HashedPasswordVO({
            value: hash,
        });
    }

    public static reconstitute(hash: string): HashedPasswordVO {
        if (!hash) {
            throw new Error('Password hash is required');
        }

        return new HashedPasswordVO({
            value: hash,
        });
    }

    public get value(): string {
        return this.props.value;
    }
}
