import { FilterOperator } from '@core/criteria/filter-operator';
import { FilterCondition, FieldFilter } from '@core/criteria/criteria';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';

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
        return {
            [fieldName]: {
                [this.operatorMap[fieldFilter.operator]]: fieldFilter.value,
                // PostgreSQL specific: enable case-insensitive search for strings
                ...(typeof fieldFilter.value === 'string' ? { mode: 'insensitive' } : {}),
            },
        } as unknown as R;
    }
}
