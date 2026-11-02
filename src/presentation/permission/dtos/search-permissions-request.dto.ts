import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { SortFieldDto } from '@shared/dtos/sort-field.dto';
import { PaginationQueryDto } from '@shared/dtos/pagination.dto';

export class SearchPermissionsRequestDto extends PaginationQueryDto {
    @ApiPropertyOptional({ type: SortFieldDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SortFieldDto)
    orderBy?: SortFieldDto;

    @ApiPropertyOptional({
        type: Object,
        description: 'FilterCondition tree: flat field filters, or AND/OR/NOT combinators',
    })
    @IsOptional()
    @IsObject()
    filter?: Record<string, unknown>;
}
