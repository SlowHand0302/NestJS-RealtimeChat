import { UseCaseOutput } from '@application/use-cases/_base.use-case';
import { PermissionActionPropEnum } from '@core/entities/permission.entity';

export interface GetPermissionResponseDto extends UseCaseOutput {
    id: string;
    action: PermissionActionPropEnum;
    subject: string;
    description: string;
    conditions: Record<string, unknown>;
    fields: string[];
    inverted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
