import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SyncRolePermissionsRequestDto {
    @ApiProperty({
        type: [String],
        example: ['a1b2c3d4-e5f6-4789-9abc-def012345678'],
        description: 'Full replacement set of permission ids. An empty array removes all permissions from the role.',
    })
    @IsArray()
    @IsUUID('4', { each: true })
    @ArrayUnique()
    permissionIds: string[];
}
