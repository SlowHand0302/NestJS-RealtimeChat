import { Role } from './role.entity';
import { EmailVO } from '@core/value-objects/email.vo';
import { AggregateRoot } from './_aggregate-root.interface';
import { PasswordVO } from '@core/value-objects/password.vo';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { UserDetailInfo, UserDetailInfoProps } from '@core/value-objects/user-detail.vo';

export enum UserStatusPropEnums {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned',
    LOCKED = 'locked',
}

interface UserProps {
    email: EmailVO;
    password: PasswordVO;
    emailVerified: boolean;
    status: UserStatusPropEnums;
    roles: Role[];
    profile: UserDetailInfo | null;
}

export class User extends AggregateRoot<UserProps> {
    private constructor(
        props: UserProps,
        id?: IdentifierVO,
        timestamp?: {
            createdAt?: Date;
            updatedAt?: Date;
            deletedAt?: Date;
        },
    ) {
        super(props, id, timestamp);
    }

    // Factory method for new users
    public static create(email: EmailVO, password: PasswordVO): User {
        const user = new User({
            email,
            password,
            emailVerified: false,
            status: UserStatusPropEnums.ACTIVE,
            roles: [],
            profile: UserDetailInfo.create(null),
        });
        return user;
    }

    // Factory method for reconstitution from persistence
    public static reconstitute(
        props: UserProps,
        id?: IdentifierVO,
        timestamp?: {
            createdAt?: Date;
            updatedAt?: Date;
            deletedAt?: Date;
        },
    ): User {
        return new User(props, id, timestamp);
    }

    // Business Methods
    public async verifyPassword(plainPassword: string): Promise<boolean> {
        return this.props.password.verify(plainPassword);
    }

    public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const isValid = this.props.password.verify(currentPassword);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        this.props.password = await PasswordVO.create(newPassword);
        this.touch();
    }

    public verifyEmail() {
        if (this.props.emailVerified) {
            return;
        }
        this.props.emailVerified = true;
        this.touch();
    }

    public changeEmail(newEmail: EmailVO) {
        if (this.props.email.equals(newEmail)) {
            return;
        }
        this.props.email = newEmail;
        this.touch();
    }

    public changeStatus(status: UserStatusPropEnums) {
        if (this.props.status === status) {
            throw new Error(`User already ${this.props.status}`);
        }
        this.props.status = status;
    }

    public delete(): void {
        if (this.isDeleted()) {
            throw new Error('User is already deleted');
        }
        this._deletedAt = new Date();
        this.touch();
    }

    public updateProfile(params: UserDetailInfoProps): void {
        if (Object.values(params).every((v) => v === undefined || v === null)) {
            return;
        }
        this.props.profile = UserDetailInfo.create(params);
        this.touch();
    }

    public hasProfile(): boolean {
        return !!this.props.profile;
    }

    public assignRole(role: Role): void {
        if (this.hasRole(role)) {
            throw new Error(`User ${this.props.email} already has role ${role.name}`);
        }
        this.props.roles = [...this.props.roles, role];
    }

    public removeRole(role: Role): void {
        this.props.roles = this.props.roles.filter((r) => !r.equals(role));
    }

    public hasRole(role: Role): boolean {
        return this.props.roles.some((r) => r.equals(role));
    }

    // Getters
    public get email(): EmailVO {
        return this.props.email;
    }

    public get password(): PasswordVO {
        return this.props.password;
    }

    public get status(): UserStatusPropEnums {
        return this.props.status;
    }

    public get emailVerified(): boolean {
        return this.props.emailVerified;
    }

    public get profile(): UserDetailInfo {
        return this.props.profile ?? UserDetailInfo.create({});
    }

    public get roles(): ReadonlyArray<Role> {
        return [...this.props.roles];
    }
}
