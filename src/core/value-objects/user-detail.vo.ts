import { BaseValueObject } from './_base.vo';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    // NON_BINARY = 'non_binary',
    // OTHER = 'other',
    // PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}
export interface UserDetailInfoProps {
    readonly nickname?: string;
    readonly avatarUrl?: string;
    readonly gender?: Gender;
    readonly birthdate?: Date;
    readonly fullname?: string;
    readonly phoneNumber?: string;
    // readonly language?: string; // usually ISO 639-1 or BCP-47 code
    // readonly socialLinks?: readonly string[];
}

export class UserDetailInfo extends BaseValueObject<UserDetailInfoProps> {
    private constructor(props: UserDetailInfoProps) {
        super(props);
    }

    public static create(input: UserDetailInfoProps): UserDetailInfo {
        // Normalize & lightly sanitize
        const props: UserDetailInfoProps = {
            nickname: input.nickname?.trim() || undefined,
            avatarUrl: input.avatarUrl?.trim() || undefined,
            gender: input.gender,
            birthdate: input.birthdate,
            fullname: input.fullname?.trim() || undefined,
            phoneNumber: input.phoneNumber?.trim() || undefined,
            // language: input.language?.trim().toLowerCase() || undefined,
            // socialLinks: input.socialLinks
            //     ? [...new Set(input.socialLinks.map((link) => link.trim()).filter(Boolean))]
            //     : undefined,
        };

        // Minimal defensive business rules (expand later)
        if (props.nickname && (props.nickname.length < 2 || props.nickname.length > 50)) {
            throw new Error('Nickname must be between 2 and 50 characters');
        }

        if (props.fullname && props.fullname.length > 120) {
            throw new Error('Full name must not exceed 120 characters');
        }

        if (props.birthdate && props.birthdate > new Date()) {
            throw new Error('Birthdate cannot be in the future');
        }

        // if (props.language && props.language.length > 10) {
        //     throw new Error('Language code appears to be invalid');
        // }

        if (props.avatarUrl && !props.avatarUrl.startsWith('http')) {
            throw new Error('Avatar URL must start with http/https');
        }

        return new UserDetailInfo(props);
    }

    // Convenience getters (optional – improves DX)
    public get nickname() {
        return this.props.nickname;
    }
    public get avatarUrl() {
        return this.props.avatarUrl;
    }
    public get gender() {
        return this.props.gender;
    }
    public get birthdate() {
        return this.props.birthdate;
    }
    public get fullname() {
        return this.props.fullname;
    }
    public get phoneNumber() {
        return this.props.phoneNumber;
    }
    // public get language() {
    //     return this.props.language;
    // }
    // public get socialLinks() {
    //     return this.props.socialLinks;
    // }

    // Small domain behaviors (easy to test & reuse)
    public hasAvatar(): boolean {
        return !!this.props.avatarUrl && this.props.avatarUrl.length > 0;
    }

    public ageInYears(asOf: Date = new Date()): number | undefined {
        if (!this.props.birthdate) return undefined;
        let age = asOf.getFullYear() - this.props.birthdate.getFullYear();
        const m = asOf.getMonth() - this.props.birthdate.getMonth();
        if (m < 0 || (m === 0 && asOf.getDate() < this.props.birthdate.getDate())) {
            age--;
        }
        return age;
    }

    public isProbablyAdult(asOf: Date = new Date()): boolean {
        const age = this.ageInYears(asOf);
        return age !== undefined && age >= 18;
    }

    // public hasSocialLinks(): boolean {
    //     return Array.isArray(this.props.socialLinks) && this.props.socialLinks.length > 0;
    // }
}
