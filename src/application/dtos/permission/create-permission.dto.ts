import { UseCaseInput } from '@application/use-cases/_base.use-case';
import { PermissionActionPropEnum } from '@core/entities/permission.entity';

export interface CreatePermissionDto extends UseCaseInput {
    action: PermissionActionPropEnum;
    subject: string;
    description?: string;
    conditions?: Record<string, unknown>;
    fields?: string[];
    inverted?: boolean;
}
