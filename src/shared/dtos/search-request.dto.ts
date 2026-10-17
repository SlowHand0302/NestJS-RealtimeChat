import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator';

/**
 * Shared body of every POST .../search endpoint.
 *
 * Generic over the filter and sort types so a controller can declare the exact,
 * entity-specific shapes it receives, without this folder importing from any
 * layer. The global ValidationPipe validates page and limit; sort and filter are
 * only checked to be objects here, and are fully validated (with the filter's
 * date strings converted to Date) by the search pipe.
 */
export class SearchRequestDto<TFilter = Record<string, unknown>, TSort = Record<string, unknown>> {
    @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({
        type: Object,
        description: 'Single sort. Both field and direction are required when sort is sent.',
        example: { field: 'createdAt', direction: 'desc' },
    })
    @IsOptional()
    @IsObject()
    sort?: TSort;

    @ApiPropertyOptional({
        type: Object,
        description:
            'Filter tree. A field condition is { field: { operator, value } }; AND / OR take an array of conditions and NOT takes one condition.',
        example: {
            AND: [
                { subject: { operator: 'contains', value: 'user' } },
                { deletedAt: { operator: 'equals', value: null } },
            ],
        },
    })
    @IsOptional()
    @IsObject()
    filter?: TFilter;
}
