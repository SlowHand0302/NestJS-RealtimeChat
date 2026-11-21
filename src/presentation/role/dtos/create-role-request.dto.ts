import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleRequestDto {
    @ApiProperty({ example: 'moderator' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Can moderate user content' })
    @IsOptional()
    @IsString()
    description?: string;
}
