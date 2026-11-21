import { ApiProperty } from '@nestjs/swagger';

import { PermissionResponseDto } from '@presentation/permission/dtos/permission-response.dto';

export class RoleResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: [PermissionResponseDto] })
    permissions: PermissionResponseDto[];

    @ApiProperty({ type: Date, nullable: true })
    deletedAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
