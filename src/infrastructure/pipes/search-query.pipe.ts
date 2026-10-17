import { BadRequestException, PipeTransform } from '@nestjs/common';

import { FilterOperator } from '@core/criteria/filter-operator';
import { FIELD_KIND_OPERATORS } from '@core/criteria/field-kind';
import { SearchRequestDto } from '@shared/dtos/search-request.dto';
import { AggregateRoot } from '@core/entities/_aggregate-root.interface';
import { FieldOrder, FilterCondition, PropsOf } from '@core/criteria/criteria';
import { DEFAULT_SEARCH_LIMITS, SearchConfig, SearchFieldConfig, SearchLimits } from './search-config';

const LOGICAL_KEYS: readonly string[] = ['AND', 'OR', 'NOT'];
const FIELD_FILTER_KEYS: readonly string[] = ['operator', 'value', 'caseSensitive'];
const LIST_OPERATORS: readonly FilterOperator[] = ['in', 'notIn'];
const NULLABLE_OPERATORS: readonly FilterOperator[] = ['equals', 'not'];

// YYYY-MM-DD, or a date-time that carries an explicit timezone (Z or +hh:mm).
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/;

type SearchQuery<T extends AggregateRoot> = SearchRequestDto<
    FilterCondition<T, keyof PropsOf<T>>,
    FieldOrder<T, keyof PropsOf<T>>
>;

interface ParseState {
    conditions: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validates the sort and filter of a search request against a module's
 * SearchConfig, and returns them in the shape the use case expects (filter
 * values already converted, e.g. date strings to Date).
 *
 * Runs after the global ValidationPipe, which has already validated page and
 * limit. Stops at the first problem and reports it with its location.
 */
export class SearchQueryPipe<T extends AggregateRoot> implements PipeTransform<SearchRequestDto, SearchQuery<T>> {
    private readonly limits: SearchLimits;

    constructor(private readonly config: SearchConfig<T>) {
        this.limits = { ...DEFAULT_SEARCH_LIMITS, ...config.limits };
    }

    transform(query: SearchRequestDto): SearchQuery<T> {
        return {
            page: query.page,
            limit: query.limit,
            sort: query.sort == null ? undefined : this.parseSort(query.sort),
            filter: query.filter == null ? undefined : this.parseFilter(query.filter),
        };
    }

    // --- Sort ---

    private parseSort(raw: Record<string, unknown>): FieldOrder<T, keyof PropsOf<T>> {
        for (const key of Object.keys(raw)) {
            if (key !== 'field' && key !== 'direction') {
                throw this.problem(`sort.${key}`, 'is not a recognised property (expected field and direction)');
            }
        }

        const { field, direction } = raw;
        if (typeof field !== 'string') {
            throw this.problem('sort.field', 'is required and must be a string');
        }
        if (!this.getFieldConfig(field)?.sortable) {
            throw this.problem(
                'sort.field',
                `"${field}" cannot be sorted on. Sortable fields: ${this.fieldNames((config) => config.sortable === true)}`,
            );
        }
        if (direction !== 'asc' && direction !== 'desc') {
            throw this.problem('sort.direction', "is required and must be 'asc' or 'desc'");
        }

        return { field: field as keyof PropsOf<T>, direction };
    }

    // --- Filter ---

    private parseFilter(raw: Record<string, unknown>): FilterCondition<T, keyof PropsOf<T>> {
        // An empty filter means "no filter".
        if (Object.keys(raw).length === 0) return {};
        return this.parseNode(raw, 'filter', 1, { conditions: 0 });
    }

    private parseNode(
        node: unknown,
        path: string,
        depth: number,
        state: ParseState,
    ): FilterCondition<T, keyof PropsOf<T>> {
        if (!isRecord(node)) {
            throw this.problem(path, 'must be an object');
        }
        if (depth > this.limits.maxDepth) {
            throw this.problem(path, `is nested too deeply (maximum depth is ${this.limits.maxDepth})`);
        }

        const keys = Object.keys(node);
        if (keys.length === 0) {
            throw this.problem(path, 'must not be empty');
        }

        if (!keys.some((key) => LOGICAL_KEYS.includes(key))) {
            return this.parseFieldConditions(node, path, state);
        }
        if (keys.length > 1) {
            throw this.problem(
                path,
                'AND, OR and NOT cannot be combined with each other or with field conditions in the same object',
            );
        }

        const [key] = keys;
        const groupPath = `${path}.${key}`;

        if (key === 'NOT') {
            return { NOT: this.parseNode(node[key], groupPath, depth + 1, state) };
        }

        const items = node[key];
        if (!Array.isArray(items) || items.length === 0) {
            throw this.problem(groupPath, 'must be a non-empty array of conditions');
        }
        const parsed = (items as unknown[]).map((item, index) =>
            this.parseNode(item, `${groupPath}[${index}]`, depth + 1, state),
        );

        return key === 'AND' ? { AND: parsed } : { OR: parsed };
    }

    private parseFieldConditions(
        node: Record<string, unknown>,
        path: string,
        state: ParseState,
    ): FilterCondition<T, keyof PropsOf<T>> {
        const result: Record<string, unknown> = {};

        for (const [fieldName, rawFilter] of Object.entries(node)) {
            state.conditions += 1;
            if (state.conditions > this.limits.maxConditions) {
                throw this.problem(path, `contains too many conditions (maximum is ${this.limits.maxConditions})`);
            }
            result[fieldName] = this.parseFieldFilter(fieldName, rawFilter, `${path}.${fieldName}`);
        }

        return result as unknown as FilterCondition<T, keyof PropsOf<T>>;
    }

    private parseFieldFilter(fieldName: string, raw: unknown, path: string): Record<string, unknown> {
        const config = this.getFieldConfig(fieldName);
        if (!config) {
            throw this.problem(
                path,
                `"${fieldName}" cannot be filtered on. Filterable fields: ${this.fieldNames(() => true)}`,
            );
        }
        if (!isRecord(raw)) {
            throw this.problem(path, 'must be an object with operator and value');
        }
        for (const key of Object.keys(raw)) {
            if (!FIELD_FILTER_KEYS.includes(key)) {
                throw this.problem(
                    `${path}.${key}`,
                    'is not a recognised property (expected operator, value and optionally caseSensitive)',
                );
            }
        }

        const { operator, value, caseSensitive } = raw;

        const allowedOperators: readonly string[] = FIELD_KIND_OPERATORS[config.kind];
        if (typeof operator !== 'string' || !allowedOperators.includes(operator)) {
            throw this.problem(
                `${path}.operator`,
                `must be one of: ${allowedOperators.join(', ')} (for ${config.kind} fields)`,
            );
        }
        const filterOperator = operator as FilterOperator;

        if (caseSensitive !== undefined) {
            if (filterOperator !== 'equals' || config.kind !== 'string') {
                throw this.problem(
                    `${path}.caseSensitive`,
                    "is only supported with the 'equals' operator on string fields",
                );
            }
            if (typeof caseSensitive !== 'boolean') {
                throw this.problem(`${path}.caseSensitive`, 'must be a boolean');
            }
        }

        if (value === undefined) {
            throw this.problem(`${path}.value`, 'is required');
        }
        const parsedValue = LIST_OPERATORS.includes(filterOperator)
            ? this.parseValueList(config, value, `${path}.value`)
            : this.parseValue(config, value, `${path}.value`, filterOperator);

        return caseSensitive === undefined
            ? { operator: filterOperator, value: parsedValue }
            : { operator: filterOperator, value: parsedValue, caseSensitive };
    }

    // --- Values ---

    private parseValueList(config: SearchFieldConfig, raw: unknown, path: string): unknown[] {
        if (!Array.isArray(raw) || raw.length === 0) {
            throw this.problem(path, 'must be a non-empty array');
        }
        if (raw.length > this.limits.maxInValues) {
            throw this.problem(path, `must not contain more than ${this.limits.maxInValues} values`);
        }
        return (raw as unknown[]).map((item, index) => this.parseScalar(config, item, `${path}[${index}]`));
    }

    private parseValue(config: SearchFieldConfig, raw: unknown, path: string, operator: FilterOperator): unknown {
        if (raw === null) {
            if (config.nullable && NULLABLE_OPERATORS.includes(operator)) return null;
            throw this.problem(
                path,
                config.nullable ? "null is only supported with the 'equals' and 'not' operators" : 'must not be null',
            );
        }
        if (config.kind === 'date' && operator === 'equals') {
            throw this.problem(
                path,
                "must be null: 'equals' on a date field only supports null (use gte and lt for ranges)",
            );
        }
        return this.parseScalar(config, raw, path);
    }

    private parseScalar(config: SearchFieldConfig, raw: unknown, path: string): unknown {
        switch (config.kind) {
            case 'string':
                if (typeof raw !== 'string') throw this.problem(path, 'must be a string');
                return raw;
            case 'enum':
                if (typeof raw !== 'string' || !config.values.includes(raw)) {
                    throw this.problem(path, `must be one of: ${config.values.join(', ')}`);
                }
                return raw;
            case 'boolean':
                if (typeof raw !== 'boolean') throw this.problem(path, 'must be a boolean');
                return raw;
            case 'date':
                return this.parseDate(raw, path);
        }
    }

    private parseDate(raw: unknown, path: string): Date {
        if (typeof raw !== 'string' || !ISO_DATE_PATTERN.test(raw)) {
            throw this.problem(
                path,
                'must be an ISO 8601 date (YYYY-MM-DD) or date-time with a timezone, e.g. 2026-01-31T10:00:00Z',
            );
        }
        // Date rolls impossible calendar dates over (2026-02-31 becomes 2026-03-03), so check the date part itself.
        const [year, month, day] = raw.slice(0, 10).split('-').map(Number);
        const calendarDate = new Date(Date.UTC(year, month - 1, day));
        const isRealCalendarDate =
            calendarDate.getUTCFullYear() === year &&
            calendarDate.getUTCMonth() === month - 1 &&
            calendarDate.getUTCDate() === day;

        const date = new Date(raw);
        if (!isRealCalendarDate || Number.isNaN(date.getTime())) {
            throw this.problem(path, 'is not a valid date');
        }
        return date;
    }

    // --- Helpers ---

    // Own-property lookup only, so names like "constructor" or "__proto__" never resolve to inherited members.
    private getFieldConfig(name: string): SearchFieldConfig | undefined {
        return Object.prototype.hasOwnProperty.call(this.config.fields, name)
            ? (this.config.fields as Record<string, SearchFieldConfig | undefined>)[name]
            : undefined;
    }

    private fieldNames(predicate: (config: SearchFieldConfig) => boolean): string {
        return Object.entries(this.config.fields as Record<string, SearchFieldConfig>)
            .filter(([, config]) => predicate(config))
            .map(([name]) => name)
            .join(', ');
    }

    private problem(path: string, message: string): BadRequestException {
        return new BadRequestException(`${path}: ${message}`);
    }
}
