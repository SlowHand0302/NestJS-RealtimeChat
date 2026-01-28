export enum PermissionActionPropEnum {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
}

export class Permission {
    private constructor(
        public readonly resource: string,
        public readonly action: PermissionActionPropEnum,
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.resource || this.resource.trim().length === 0) {
            throw new Error('Resource cannot be empty');
        }
        if (!this.action || this.action.trim().length === 0) {
            throw new Error('Action cannot be empty');
        }
    }

    static create(resource: string, action: PermissionActionPropEnum): Permission {
        return new Permission(resource, action);
    }

    equals(other: Permission): boolean {
        return this.resource === other.resource && this.action === other.action;
    }

    policyKey(): string {
        return `${this.resource}:${this.action}`;
    }

    matches(resource: string, action: PermissionActionPropEnum): boolean {
        const resourceMatch = this.resource === '*' || this.resource === resource;
        const actionMatch = this.action === action;
        return resourceMatch && actionMatch;
    }
}
