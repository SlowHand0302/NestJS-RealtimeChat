import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ nullable: true, type: String })
    clientDeviceId: string | null;

    @ApiProperty({ nullable: true, type: String })
    deviceName: string | null;

    @ApiProperty({ nullable: true, type: String })
    ipAddress: string | null;

    @ApiProperty({ nullable: true, type: String })
    userAgent: string | null;

    @ApiProperty()
    expiresAt: Date;

    @ApiProperty()
    lastUsedAt: Date;

    @ApiProperty()
    createdAt: Date;
}
