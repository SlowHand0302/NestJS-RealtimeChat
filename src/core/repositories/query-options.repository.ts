export interface QueryOptions<T = unknown> {
    where?: Record<string, unknown> | Record<string, unknown>[];
    orderBy?: Record<string, 'asc' | 'desc' | { _count?: 'asc' | 'desc' }>;
    select?: (keyof T)[];
    include?: Record<string, boolean | QueryOptions>;
    skip?: number;
    take?: number;
    search?: string; // full-text or simple search
    // relations?: string[];                  // if not using include style
}

// Many teams rename QueryOptions → more intention-revealing names:
// FindManyOptions
// QueryCriteria
// FilterOptions
// SearchParams
// RepositoryQuery
