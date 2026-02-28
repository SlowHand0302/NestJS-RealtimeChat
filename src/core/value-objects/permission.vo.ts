import { BaseValueObject } from './_base.vo';

export enum PermissionActionPropEnum {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage',
}

interface PermissionVOProps {
    readonly resource: string;
    readonly action: PermissionActionPropEnum;
}

export class Permission extends BaseValueObject<PermissionVOProps> {
    private constructor(props: PermissionVOProps) {
        super(props);
    }

    /**
     * Creates a new Permission from untrusted input (e.g. DTO, user request, config file)
     * Enforces validation rules.
     */
    public static create(resource: string, action: PermissionActionPropEnum | string): Permission {
        const normalizedResource = (resource ?? '').trim();

        if (!normalizedResource) {
            throw new Error('Resource name is required for permission');
        }

        // Normalize action to enum value (safe cast + validation)
        let normalizedAction: PermissionActionPropEnum;

        if (typeof action === 'string') {
            const upperAction = action.trim().toLowerCase();
            const found = Object.values(PermissionActionPropEnum).find((v) => v === upperAction);

            if (!found) {
                throw new Error(
                    `Invalid permission action: "${action}". Allowed: ${Object.values(PermissionActionPropEnum).join(', ')}`,
                );
            }

            normalizedAction = found;
        } else {
            normalizedAction = action;
        }

        return new Permission({
            resource: normalizedResource,
            action: normalizedAction,
        });
    }

    /**
     * Reconstitutes from trusted persistence (database, cache, event store...)
     * Minimal validation — assumes data is already correct.
     */
    public static reconstitute(raw: PermissionVOProps | { resource: string; action: string }): Permission {
        const action = raw.action.trim().toLowerCase() as PermissionActionPropEnum;

        if (!Object.values(PermissionActionPropEnum).includes(action)) {
            throw new Error(`Invalid stored permission action: ${raw.action}`);
        }

        return new Permission({
            resource: raw.resource.trim(),
            action,
        });
    }

    public get resource(): string {
        return this.props.resource;
    }

    public get action(): PermissionActionPropEnum {
        return this.props.action;
    }

    /**
     * Alias for readability in guards / policies
     * Example: if (permission.can(PermissionActionPropEnum.READ)) { ... }
     */
    public can(desiredAction: PermissionActionPropEnum): boolean {
        return this.props.action === desiredAction;
    }

    /**
     * Very useful when logging, debugging or serializing
     */
    public toString(): string {
        return `${this.props.action}:${this.props.resource}`;
    }

    public toJSON(): PermissionVOProps {
        return {
            resource: this.props.resource,
            action: this.props.action,
        };
    }

    /**
     * Value equality – shallow comparison (sufficient for this VO)
     */
    // public equals(other: Permission | null | undefined): boolean {
    //     if (other == null) return false;
    //     if (this === other) return true;

    //     return this.props.resource === other.props.resource && this.props.action === other.props.action;
    // }
}
