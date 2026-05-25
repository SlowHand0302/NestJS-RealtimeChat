export abstract class BaseValueObject<Props = unknown> {
    public readonly props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    public equals(vo?: BaseValueObject<Props>): boolean {
        if (vo === null || vo === undefined) return false;
        if (vo.props === undefined) return false;
        return BaseValueObject.deepEqual(this.props, vo.props);
    }

    public toString(): string {
        return `[${this.constructor.name}] ${JSON.stringify(this.props)}`;
    }

    private static deepEqual(a: unknown, b: unknown): boolean {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (typeof a !== typeof b) return false;

        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }

        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((item, i) => BaseValueObject.deepEqual(item, b[i]));
        }

        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a as object);
            const keysB = Object.keys(b as object);
            if (keysA.length !== keysB.length) return false;
            return keysA.every((key) =>
                BaseValueObject.deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
            );
        }

        return false;
    }
}
