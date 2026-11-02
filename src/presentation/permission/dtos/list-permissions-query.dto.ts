import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDirection } from '@shared/dtos/sort-field.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@shared/dtos/pagination.dto';

export class ListPermissionsQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ example: 'createdAt' })
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiPropertyOptional({ enum: OrderDirection, example: OrderDirection.DESC })
    @IsOptional()
    @IsEnum(OrderDirection)
    sortDirection?: OrderDirection;
}
