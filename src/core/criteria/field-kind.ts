import { FilterOperator } from './filter-operator';

/**
 * The kinds of value a filterable field can hold. A field's kind decides both
 * which operators may be used on it and how its filter values are validated.
 */
export type FieldKind = 'string' | 'enum' | 'boolean' | 'date';

/**
 * Single source of truth for which filter operators each field kind supports.
 * Consumers (e.g. the search validation pipe) read from here instead of keeping
 * their own operator lists, so a new operator or kind is declared in one place.
 */
export const FIELD_KIND_OPERATORS: Readonly<Record<FieldKind, readonly FilterOperator[]>> = {
    string: ['equals', 'not', 'contains', 'startsWith', 'endsWith', 'in', 'notIn'],
    enum: ['equals', 'not', 'in', 'notIn'],
    boolean: ['equals', 'not'],
    // 'equals' on a date matches one exact UTC instant. It is kept for null checks only
    // (e.g. deletedAt equals null); use gte / lt for ranges.
    date: ['equals', 'not', 'gt', 'gte', 'lt', 'lte'],
};
