import { FilterOperator } from '@core/criteria/filter-operator';
import { FilterCondition, FieldFilter } from '@core/criteria/criteria';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
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
        // This part maps: { email: { operator: 'contains', value: '@gmail.com' } }
        // To: { email: { contains: '@gmail.com', mode: 'insensitive' } }
        const fieldName = Object.keys(condition)[0] as string;
        const fieldFilter = condition[fieldName] as FieldFilter<T[K]>;
        const rawValue = this.unwrapValue(fieldFilter.value);

        return {
            [fieldName]: {
                [this.operatorMap[fieldFilter.operator]]: rawValue,
                // PostgreSQL specific: enable case-insensitive search for strings
                ...(typeof rawValue === 'string' ? { mode: 'insensitive' } : {}),
            },
        } as unknown as R;
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
