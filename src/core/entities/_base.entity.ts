import { EntityIdVO } from '@core/value-objects/entity-id.vo';

export abstract class BaseEntity<Props = unknown> {
    protected readonly _id: EntityIdVO;
    protected props: Props;
    protected readonly _createdAt: Date;
    protected _updatedAt: Date;
    protected _deletedAt?: Date;

    constructor(props: Props, id?: EntityIdVO, timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date }) {
        this.props = props;
        this._id = id ?? EntityIdVO.create();
        this._createdAt = timestamp?.createdAt ?? new Date();
        this._updatedAt = timestamp?.updatedAt ?? new Date();
        this._deletedAt = timestamp?.deletedAt;
    }

    public get id(): EntityIdVO {
        return this.id;
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
