import { FilterOperator } from '@core/criteria/filter-operator';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FilterCondition, FieldFilter, FieldOrder } from '@core/criteria/criteria';
import { PrimitiveValueObject } from '@core/value-objects/_primitive-value-object.interface';

export class PrismaQueryMapper {
    private static readonly operatorMap: Record<FilterOperator, string> = {
        equals: 'equals',
        not: 'not',
        contains: 'contains',
        startsWith: 'startsWith',
        endsWith: 'endsWith',
        in: 'in',
        notIn: 'notIn',
        gt: 'gt',
        gte: 'gte',
        lt: 'lt',
        lte: 'lte',
    };
    private static readonly TEXT_SEARCH_OPERATORS = new Set<FilterOperator>(['contains', 'startsWith', 'endsWith']);

    static toPrismaWhere<T extends AggregateRoot, K extends keyof T, R>(condition: FilterCondition<T, K>): R {
        // 1. Handle Logical Filters (AND/OR/NOT)
        if ('AND' in condition && condition.AND) {
            return { AND: condition.AND.map((c) => this.toPrismaWhere(c)) } as unknown as R;
        }
        if ('OR' in condition && condition.OR) {
            return { OR: condition.OR.map((c) => this.toPrismaWhere(c)) } as unknown as R;
        }
        if ('NOT' in condition && condition.NOT) {
            return { NOT: this.toPrismaWhere(condition.NOT) } as unknown as R;
        }

        // 2. Handle Field Filters
        // Every key in `condition` is processed — not just the first — and
        // combined as an implicit AND, matching Prisma's own default behavior
        // when multiple fields appear in one `where` object. e.g.:
        // { id: {...}, userId: {...} } -> { id: {...}, userId: {...} } (both applied)
        const result: Record<string, unknown> = {};

        for (const [fieldName, fieldFilter] of Object.entries(condition)) {
            const filter = fieldFilter as FieldFilter<T[K]>;
            const rawValue = this.unwrapValue(filter.value);
            const isCaseInsensitive =
                this.TEXT_SEARCH_OPERATORS.has(filter.operator) ||
                (filter.operator === 'equals' && 'caseSensitive' in filter && filter.caseSensitive === false);

            result[fieldName] = {
                [this.operatorMap[filter.operator]]: rawValue,
                // Case-insensitive matching only makes sense for text-pattern
                // operators. Applying it to 'equals'/'in'/etc. would silently
                // case-fold values where case is meaningful (UUIDs, hashes,
                // exact-match identifiers) — including VO-wrapped ids unwrapped
                // by unwrapValue() above, which are strings by the time they
                // reach this check but were never meant to be searched as text.
                ...(isCaseInsensitive && typeof rawValue === 'string' ? { mode: 'insensitive' } : {}),
            };
        }

        return result as unknown as R;
    }

    /**
     * Translates a single-field FieldOrder into Prisma's orderBy shape.
     * e.g. { field: 'lastUsedAt', direction: 'desc' } -> { lastUsedAt: 'desc' }
     */
    static toPrismaOrderBy<T extends AggregateRoot, K extends keyof T, R>(order: FieldOrder<T, K>): R {
        return { [order.field]: order.direction } as unknown as R;
    }

    /**
     * Unwraps a filter value before handing it to Prisma.
     *
     * Filter values are sometimes value objects (e.g. Device.id is typed as
     * IdentifierVO, not string) — see PrimitiveValueObject for why. Prisma
     * needs the raw primitive, so:
     *   - a single VO implementing PrimitiveValueObject → its .primitiveValue
     *   - an array (the 'in'/'notIn' case) → each item unwrapped the same way
     *   - anything else (already a raw string/number/Date/etc.) → passed through
     */
    private static unwrapValue(value: unknown): unknown {
        if (Array.isArray(value)) {
            return value.map((item) => this.unwrapValue(item));
        }
        if (this.isPrimitiveValueObject(value)) {
            return value.primitiveValue;
        }
        return value;
    }

    private static isPrimitiveValueObject(value: unknown): value is PrimitiveValueObject<unknown> {
        return typeof value === 'object' && value !== null && 'primitiveValue' in value;
    }
}
