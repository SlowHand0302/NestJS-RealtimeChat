import { ApiProperty } from '@nestjs/swagger';
import { PermissionActionPropEnum } from '@core/entities/permission.entity';

export class PermissionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: PermissionActionPropEnum })
    action: PermissionActionPropEnum;

    @ApiProperty()
    subject: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: Object })
    conditions: Record<string, unknown>;

    @ApiProperty({ type: [String] })
    fields: string[];

    @ApiProperty()
    inverted: boolean;

    @ApiProperty({ type: Date, nullable: true })
    deletedAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
