import { UseCaseOutput } from '@application/use-cases/_base.use-case';

export interface GetActiveSessionResponseDto extends UseCaseOutput {
    id: string;
    clientDeviceId: string | null;
    deviceName: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
    lastUsedAt: Date;
    createdAt: Date;
}

export interface GetActiveSessionPaginatedResponseDto extends UseCaseOutput {
    items: GetActiveSessionResponseDto[];
    total: number;
}
