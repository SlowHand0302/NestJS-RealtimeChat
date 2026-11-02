import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { PermissionActionPropEnum } from '@core/entities/permission.entity';
import { APP_SUBJECT_NAMES } from '@infrastructure/casl/casl-ability.types';

export class UpdatePermissionRequestDto {
    @ApiPropertyOptional({ enum: PermissionActionPropEnum, example: PermissionActionPropEnum.READ })
    @IsOptional()
    @IsEnum(PermissionActionPropEnum)
    action?: PermissionActionPropEnum;

    @ApiPropertyOptional({ enum: APP_SUBJECT_NAMES, example: 'PermissionSubject' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsIn(APP_SUBJECT_NAMES)
    subject?: string;

    @ApiPropertyOptional({ example: 'Allows reading permissions' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ type: Object, example: { ownerId: '{{ user.id }}' } })
    @IsOptional()
    @IsObject()
    conditions?: Record<string, unknown>;

    @ApiPropertyOptional({ type: [String], example: ['title', 'body'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];

    @ApiPropertyOptional({ example: false, description: 'true makes this an explicit denial (cannot rule)' })
    @IsOptional()
    @IsBoolean()
    inverted?: boolean;
}
