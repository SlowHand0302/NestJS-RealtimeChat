import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class SortFieldDto {
    @ApiPropertyOptional({ example: 'createdAt' })
    @IsString()
    field: string;

    @ApiPropertyOptional({ enum: OrderDirection, example: OrderDirection.DESC })
    @IsEnum(OrderDirection)
    direction: OrderDirection = OrderDirection.DESC;
}
