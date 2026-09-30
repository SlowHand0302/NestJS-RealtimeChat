import { BaseEntity } from '@core/entities/_base.entity';
import { FilterOperator } from './filter-operator';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';

export type FunctionProperties = (...args: never[]) => unknown;

export type NonFunctionKeys<T> = {
    [K in keyof T]: T[K] extends FunctionProperties ? never : K;
}[keyof T];

/**
 * The base fields every entity exposes via BaseEntity, derived (not
 * hand-listed) from BaseEntity's own public getters, so this can't
 * drift out of sync if BaseEntity's getters change — see NonFunctionKeys.
 * Currently resolves to: id, createdAt, updatedAt, deletedAt.
 *
 * To exclude a specific base field from being queryable (e.g. if a
 * future BaseEntity getter isn't a real persisted column), wrap this
 * in Omit at the point of use, e.g.:
 *   Omit<BaseEntityFields, 'someFieldYouWantExcluded'>
 * No field needs excluding today, so this stays a plain Pick.
 */
export type BaseEntityFields = Pick<BaseEntity<unknown>, NonFunctionKeys<BaseEntity<unknown>>>;

// Get queryable data fields of
export type PropsOf<T extends AggregateRoot<unknown>> = T extends AggregateRoot<infer P> ? P & BaseEntityFields : never;

export interface FieldOrder<T extends AggregateRoot, K extends keyof PropsOf<T>> {
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
export type FlatFieldsFilter<T extends AggregateRoot, K extends keyof PropsOf<T>> = {
    [P in K]?: FieldFilter<PropsOf<T>[P]>;
};

export interface LogicalFilter<T extends AggregateRoot, K extends keyof PropsOf<T>> {
    AND?: FilterCondition<T, K>[];
    OR?: FilterCondition<T, K>[];
    NOT?: FilterCondition<T, K>;
}

export type FilterCondition<T extends AggregateRoot, K extends keyof PropsOf<T>> =
    | FlatFieldsFilter<T, K>
    | LogicalFilter<T, K>;
