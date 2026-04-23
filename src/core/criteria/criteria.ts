import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FilterOperator } from './filter-operator';

export interface FieldOrder<T> {
    field: T;
    direction: 'asc' | 'desc';
}

export interface FieldFilter<T> {
    operator: FilterOperator;
    value: T;
}

export interface LogicalFilter<T extends AggregateRoot, K extends keyof T> {
    AND?: FilterCondition<T, K>[];
    OR?: FilterCondition<T, K>[];
    NOT?: FilterCondition<T, K>;
}

export type FilterCondition<T extends AggregateRoot, K extends keyof T> =
    | Record<K, FieldFilter<T[K]>>
    | LogicalFilter<T, K>;
