import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchQueryOption {
    @ApiPropertyOptional({ example: 'Some text' })
    @IsOptional()
    @IsString()
    search?: string;
}
