import { BaseValueObject } from './_base.vo';

export interface ConnectionInfoProps {
    ipAddress?: string | null;
    userAgent?: string | null;
}

export class ConnectionInfoVO extends BaseValueObject<ConnectionInfoProps> {
    private constructor(props: ConnectionInfoProps) {
        super(props);
    }

    public static create(props: ConnectionInfoProps): ConnectionInfoVO {
        this.validate(props);

        return new ConnectionInfoVO({
            ipAddress: props.ipAddress?.trim() ?? null,
            userAgent: props.userAgent?.trim() ?? null,
        });
    }

    public static reconstitute(props: ConnectionInfoProps): ConnectionInfoVO {
        return new ConnectionInfoVO({
            ipAddress: props.ipAddress ?? null,
            userAgent: props.userAgent ?? null,
        });
    }

    private static validate(props: ConnectionInfoProps): void {
        if (props.ipAddress && props.ipAddress.length > 255) {
            throw new Error('IP address is too long');
        }
        if (props.userAgent && props.userAgent.length > 2000) {
            throw new Error('User agent is too long');
        }
    }

    public get ipAddress(): string | null | undefined {
        return this.props.ipAddress;
    }

    public get userAgent(): string | null | undefined {
        return this.props.userAgent;
    }

    public toJSON() {
        return { ipAddress: this.ipAddress, userAgent: this.userAgent };
    }
}
