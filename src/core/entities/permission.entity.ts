import { BaseEntity } from './_base.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';

export enum PermissionActionPropEnum {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage',
}

export interface PermissionProps {
    action: PermissionActionPropEnum;
    subject: string;
    description?: string;
    conditions?: Record<string, unknown>; // e.g. { ownerId: '{{ user.id }}' }
    fields?: string[]; // e.g. ['title', 'body'] — restrict field access
    inverted?: boolean; // true = cannot() rule — explicit denial
}

export class Permission extends BaseEntity<PermissionProps> {
    private constructor(
        props: PermissionProps,
        id?: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ) {
        super(props, id, timestamp);
    }

    // --- Factory methods ---

    // Factory method for new permission
    public static create(
        action: PermissionActionPropEnum | string,
        subject: string,
        options?: {
            description?: string;
            conditions?: Record<string, unknown>;
            fields?: string[];
            inverted?: boolean;
        },
    ): Permission {
        const normalizedSubject = (subject ?? '').trim();
        if (!normalizedSubject) throw new Error('Subject is required');

        return new Permission({
            action: Permission.parseAction(action),
            subject: normalizedSubject,
            description: options?.description,
            conditions: options?.conditions,
            fields: options?.fields,
            inverted: options?.inverted ?? false,
        });
    }

    // Factory method for reconstitution from persistence
    public static reconstitute(
        props: PermissionProps,
        id: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ): Permission {
        return new Permission(props, id, timestamp);
    }

    // --- Business methods ---

    /**
     * Whether this permission matches a given action + subject pair.
     * Used by Role.can() without involving CASL.
     */
    public matches(subject: string, action: PermissionActionPropEnum): boolean {
        return this.props.action === action && this.props.subject === subject;
    }

    /**
     * Whether this is a denial rule (cannot).
     * CASL uses inverted=true to explicitly forbid.
     */
    public isDenial(): boolean {
        return this.props.inverted === true;
    }

    /**
     * Whether this permission is field-scoped.
     */
    public isFieldScoped(): boolean {
        return Array.isArray(this.props.fields) && this.props.fields.length > 0;
    }

    /**
     * Whether this permission has conditions (row-level scoping).
     */
    public isConditional(): boolean {
        return !!this.props.conditions && Object.keys(this.props.conditions).length > 0;
    }

    public updateDescription(description: string): void {
        this.props.description = description;
        this.touch();
    }

    public updateConditions(conditions: Record<string, unknown>): void {
        this.props.conditions = conditions;
        this.touch();
    }

    public updateFields(fields: string[]): void {
        this.props.fields = fields;
        this.touch();
    }

    // --- Getters ---

    public get action(): PermissionActionPropEnum {
        return this.props.action;
    }
    public get subject(): string {
        return this.props.subject;
    }
    public get description(): string {
        return this.props.description ?? '';
    }
    public get conditions(): Record<string, unknown> {
        return this.props.conditions ?? {};
    }
    public get fields(): string[] {
        return this.props.fields ?? [];
    }
    public get inverted(): boolean {
        return this.props.inverted ?? false;
    }

    // --- Serialization ---

    public toString(): string {
        const prefix = this.inverted ? 'CANNOT' : 'CAN';
        const fieldPart = this.isFieldScoped() ? ` [${this.props.fields!.join(', ')}]` : '';
        return `${prefix} ${this.props.action}:${this.props.subject}${fieldPart}`;
    }

    public toJSON() {
        return {
            id: this.id.value,
            action: this.props.action,
            subject: this.props.subject,
            description: this.props.description,
            conditions: this.props.conditions,
            fields: this.props.fields,
            inverted: this.props.inverted,
        };
    }

    // --- Private helpers ---

    private static parseAction(action: string | PermissionActionPropEnum): PermissionActionPropEnum {
        const normalized = action.trim().toLowerCase();
        const found = Object.values(PermissionActionPropEnum).find((v) => v === normalized);
        if (!found)
            throw new Error(
                `Invalid action: "${action}". Allowed: ${Object.values(PermissionActionPropEnum).join(', ')}`,
            );
        return found;
    }
}
