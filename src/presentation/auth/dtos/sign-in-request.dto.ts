import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInRequestDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongP@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
        description: 'Client-generated device identifier, persisted client-side across sign-ins',
    })
    @IsString()
    @IsNotEmpty()
    clientDeviceId: string;

    @ApiPropertyOptional({ example: "Nathan's MacBook Pro" })
    @IsOptional()
    @IsString()
    deviceName?: string;
}
