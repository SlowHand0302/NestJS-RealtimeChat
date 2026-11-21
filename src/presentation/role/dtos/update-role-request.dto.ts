import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateRoleRequestDto {
    @ApiPropertyOptional({ example: 'moderator' })
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({ example: 'Can moderate user content' })
    @IsOptional()
    @IsString()
    description?: string;
}
