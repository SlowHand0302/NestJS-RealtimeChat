import { FilterOperator } from './filter-operator';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';

export interface FieldOrder<T extends AggregateRoot, K extends keyof T> {
    field: K;
    direction: 'asc' | 'desc';
}

export type FieldFilter<T> =
    | { operator: Extract<FilterOperator, 'in' | 'notIn'>; value: T[] }
    | { operator: Exclude<FilterOperator, 'in' | 'notIn' | 'equals'>; value: T }
    | { operator: Extract<FilterOperator, 'equals'>; value: T; caseSensitive?: boolean };

// Flat, single-level record of per-field filters, e.g. { id: {...}, userId: {...} }.
// Implicitly ANDed across fields — pairs conceptually with LogicalFilter below,
// which is the AND/OR/NOT combinator for FilterCondition as a whole.
export type FlatFieldsFilter<T extends AggregateRoot, K extends keyof T> = {
    [P in K]?: FieldFilter<T[P]>;
};

export interface LogicalFilter<T extends AggregateRoot, K extends keyof T> {
    AND?: FilterCondition<T, K>[];
    OR?: FilterCondition<T, K>[];
    NOT?: FilterCondition<T, K>;
}

export type FilterCondition<T extends AggregateRoot, K extends keyof T> = FlatFieldsFilter<T, K> | LogicalFilter<T, K>;
