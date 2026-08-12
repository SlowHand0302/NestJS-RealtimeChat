import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FilterOperator } from './filter-operator';

export interface FieldOrder<T extends AggregateRoot, K extends keyof T> {
    field: K;
    direction: 'asc' | 'desc';
}

// export interface FieldFilter<T> {
//     operator: FilterOperator;
//     value: T;
// }

export type FieldFilter<T> =
    | { operator: Extract<FilterOperator, 'in' | 'notIn'>; value: T[] }
    | { operator: Exclude<FilterOperator, 'in' | 'notIn'>; value: T };

export interface LogicalFilter<T extends AggregateRoot, K extends keyof T> {
    AND?: FilterCondition<T, K>[];
    OR?: FilterCondition<T, K>[];
    NOT?: FilterCondition<T, K>;
}

export type FilterCondition<T extends AggregateRoot, K extends keyof T> =
    | { [P in K]?: FieldFilter<T[P]> }
    | LogicalFilter<T, K>;
