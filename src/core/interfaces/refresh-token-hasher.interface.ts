export interface IRefreshTokenHasher {
    hash(plainRefreshToken: string): Promise<string>;
    compare(plainRefreshToken: string, hashedRefreshToken: string): Promise<boolean>;
}
