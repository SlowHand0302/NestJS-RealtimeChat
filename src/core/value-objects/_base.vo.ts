import _ from 'lodash';
export abstract class BaseValueObject<Props = unknown> {
    public readonly props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    public equals(vo?: BaseValueObject<Props>): boolean {
        if (vo === null || vo === undefined) return false;
        if (vo.props === undefined) return false;
        return _.isEqual(this.props, vo.props);
    }

    public toString(): string {
        return `[${this.constructor.name}] ${JSON.stringify(this.props)}`;
    }
}
