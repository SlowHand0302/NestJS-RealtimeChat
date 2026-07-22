export const REFRESH_TOKEN_HASHER = Symbol('IRefreshTokenHasher');

export interface IRefreshTokenHasher {
    hash(plainRefreshToken: string): Promise<string>;
    compare(plainRefreshToken: string, hashedRefreshToken: string): Promise<boolean>;
}
