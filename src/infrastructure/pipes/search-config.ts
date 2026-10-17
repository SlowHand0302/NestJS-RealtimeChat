import { FieldKind } from '@core/criteria/field-kind';
import { PropsOf } from '@core/criteria/criteria';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';

export interface SearchLimits {
    /** Maximum nesting of AND / OR / NOT groups. The top-level condition counts as depth 1. */
    maxDepth: number;
    /** Maximum number of field conditions in the whole filter tree. */
    maxConditions: number;
    /** Maximum number of values in a single in / notIn list. */
    maxInValues: number;
}

/** Applied to every module that does not override a limit in its own config. */
export const DEFAULT_SEARCH_LIMITS: Readonly<SearchLimits> = {
    maxDepth: 4,
    maxConditions: 20,
    maxInValues: 50,
};

interface BaseSearchFieldConfig {
    /** Whether clients may sort on this field. Defaults to false. */
    sortable?: boolean;
    /** Whether null is an accepted value (with the equals / not operators). Defaults to false. */
    nullable?: boolean;
}

export type SearchFieldConfig =
    | (BaseSearchFieldConfig & { kind: Exclude<FieldKind, 'enum'> })
    | (BaseSearchFieldConfig & { kind: 'enum'; values: readonly string[] });

export interface SearchConfig<T extends AggregateRoot> {
    /**
     * Fields clients may filter on, keyed by the entity's own property names.
     * A property that is not listed here cannot be filtered or sorted on.
     */
    fields: Partial<Record<keyof PropsOf<T>, SearchFieldConfig>>;
    /** Optional per-module overrides of DEFAULT_SEARCH_LIMITS. Omit a key rather than setting it to undefined. */
    limits?: Partial<SearchLimits>;
}
