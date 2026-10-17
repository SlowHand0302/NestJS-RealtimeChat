import { FilterOperator } from '@core/criteria/filter-operator';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FilterCondition, FieldFilter, FieldOrder, PropsOf } from '@core/criteria/criteria';
import {
    Primitive,
    PRIMITIVE_VALUE_OBJECT,
    PrimitiveValueObject,
} from '@core/value-objects/_primitive-value-object.interface';

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

    static toPrismaWhere<T extends AggregateRoot, K extends keyof PropsOf<T>, R>(condition: FilterCondition<T, K>): R {
        const result: Record<string, unknown> = {};

        for (const [fieldName, fieldFilter] of Object.entries(condition)) {
            // 1. Handle AND / OR logical filters
            if (fieldName === 'AND' || fieldName === 'OR') {
                result[fieldName] = (fieldFilter as FilterCondition<T, K>[]).map((c) => this.toPrismaWhere(c));

                continue;
            }

            // 2. Handle NOT logical filter
            if (fieldName === 'NOT') {
                result.NOT = this.toPrismaWhere(fieldFilter as FilterCondition<T, K>);

                continue;
            }

            // 3. Handle ordinary field filters
            const filter = fieldFilter as FieldFilter<PropsOf<T>[K]>;
            const rawValue = this.unwrapValue(filter.value);

            const isCaseInsensitive =
                this.TEXT_SEARCH_OPERATORS.has(filter.operator) ||
                (filter.operator === 'equals' && 'caseSensitive' in filter && filter.caseSensitive === false);

            result[fieldName] = {
                [this.operatorMap[filter.operator]]: rawValue,
                ...(isCaseInsensitive && typeof rawValue === 'string' ? { mode: 'insensitive' } : {}),
            };
        }

        return result as unknown as R;
    }

    /**
     * Translates a single-field FieldOrder into Prisma's orderBy shape.
     * e.g. { field: 'lastUsedAt', direction: 'desc' } -> { lastUsedAt: 'desc' }
     */
    static toPrismaOrderBy<T extends AggregateRoot, K extends keyof PropsOf<T>, R>(order: FieldOrder<T, K>): R {
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

    private static isPrimitiveValueObject(value: unknown): value is PrimitiveValueObject<Primitive> {
        return (
            typeof value === 'object' &&
            value !== null &&
            PRIMITIVE_VALUE_OBJECT in value &&
            value[PRIMITIVE_VALUE_OBJECT] === true
        );
    }
}
