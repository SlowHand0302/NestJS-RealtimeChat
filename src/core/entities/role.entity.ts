import { EntityIdVO } from '@core/value-objects/entity-id.vo';
import { AggregateRoot } from './_aggregate-root.interface';
import { Permission, PermissionActionPropEnum } from '@core/value-objects/permission.vo';

interface RoleProps {
    name: string;
    permissions: Permission[];
    description?: string;
}

export class Role extends AggregateRoot<RoleProps> {
    private constructor(
        props: RoleProps,
        id?: EntityIdVO,
        timestamp?: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
        },
    ) {
        super(props, id, timestamp);
    }

    // Factory method for new role
    public static create(name: string, permissions: Permission[] = [], description?: string): Role {
        const role = new Role({ name, permissions: permissions, description });
        return role;
    }

    // Factory method for reconstitution from persistence
    public static reconstitute(
        props: RoleProps,
        id?: EntityIdVO,
        timestamp?: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
        },
    ): Role {
        return new Role(props, id, timestamp);
    }

    // Business Methods
    public can(resource: string, action: PermissionActionPropEnum): boolean {
        return this.props.permissions.some((p) => p.matches(resource, action));
    }

    public hasPermission(permission: Permission): boolean {
        return this.permissions.some((p) => p.equals(permission));
    }

    public addPermission(permission: Permission): void {
        if (this.props.permissions.some((p) => permission.policyKey === p.policyKey)) {
            throw new Error(`Permission ${permission.policyKey()} already exists in role ${this.props.name}`);
        }
        this.props.permissions = [...this.props.permissions, permission];
    }

    public removePermission(permission: Permission): void {
        this.props.permissions = this.props.permissions.filter((p) => p.equals(permission));
    }

    // Getters
    public get name(): string {
        return this.props.name;
    }

    public get permissions(): Permission[] {
        return [...this.props.permissions];
    }
}
