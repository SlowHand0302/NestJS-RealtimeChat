export enum UserDetailGenderPropEnum {
    MALE = 'male',
    FEMALE = 'female',
}

export class UserDetail {
    public nickname?: string;
    public avatarUrl?: string;
    public gender?: UserDetailGenderPropEnum;
    public birthdate?: Date;
    public fullname?: string;
    public phoneNumber?: string;
    public location?: string;
    public language?: string;
    public socialLinks?: string[];
}
