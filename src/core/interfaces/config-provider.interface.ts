export const CONFIG_PROVIDER = Symbol('IConfigProvider');

export interface IConfigProvider {
    getRefreshTokenTtl(): string;
}
