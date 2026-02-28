import { IdentifierVO } from '@core/value-objects/identifier.vo';

export abstract class BaseEntity<Props = unknown> {
    protected readonly _id: IdentifierVO;
    protected props: Props;
    protected readonly _createdAt: Date;
    protected _updatedAt: Date;
    protected _deletedAt?: Date;

    constructor(props: Props, id?: IdentifierVO, timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date }) {
        this.props = props;
        this._id = id ?? IdentifierVO.create();
        this._createdAt = timestamp?.createdAt ?? new Date();
        this._updatedAt = timestamp?.updatedAt ?? new Date();
        this._deletedAt = timestamp?.deletedAt;
    }

    public get id(): IdentifierVO {
        return this._id;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public get deletedAt(): Date {
        return this._deletedAt;
    }

    public equals(other?: BaseEntity<Props>): boolean {
        if (!other) return false;
        if (other === this) return true;
        return this._id.equals(other._id);
    }

    protected touch(): void {
        this._updatedAt = new Date();
    }

    public isDeleted(): boolean {
        return !!this._deletedAt;
    }
}
