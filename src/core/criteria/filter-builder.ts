import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FilterCondition, FieldFilter } from './criteria';

export class FilterBuilder<T extends AggregateRoot, K extends keyof T> {
    private conditions: FilterCondition<T, K>[] = [];

    // Add a simple field filter (e.g. name contains "john")
    field(field: K, filter: FieldFilter<T[K]>): this {
        this.conditions.push({ [field]: filter });
        return this;
    }

    // Add multiple conditions with AND
    and(...conditions: FilterCondition<T, K>[]): this {
        this.conditions.push({ AND: conditions });
        return this;
    }

    // Add multiple conditions with OR
    or(...conditions: FilterCondition<T, K>[]): this {
        this.conditions.push({ OR: conditions });
        return this;
    }

    // Add NOT condition
    not(condition: FilterCondition<T, K>): this {
        this.conditions.push({ NOT: condition });
        return this;
    }

    // Build final filter object for Prisma
    build(): FilterCondition<T, K>[] {
        return this.conditions.length > 0 ? this.conditions : [];
    }

    // Clear for reuse
    clear(): this {
        this.conditions = [];
        return this;
    }
}
