import { UseCaseInput } from '@application/use-cases/_base.use-case';
import { PermissionActionPropEnum } from '@core/entities/permission.entity';

export interface UpdatePermissionDto extends UseCaseInput {
    permissionId: string;
    action?: PermissionActionPropEnum;
    subject?: string;
    description?: string;
    conditions?: Record<string, unknown>;
    fields?: string[];
    inverted?: boolean;
}
