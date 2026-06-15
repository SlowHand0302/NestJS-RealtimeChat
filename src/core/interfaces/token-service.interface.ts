export const TOKEN_SERVICE = Symbol('ITokenService');
export interface AccessTokenPayload {
    sub: string;
    email: string;
    roles?: string[];
    permissions?: string[];
    sessionId?: string;
}

export interface RefreshTokenPayload {
    sub: string;
    sessionId: string;
}

export interface ITokenService {
    generateAccessToken(payload: AccessTokenPayload): Promise<string>;
    generateRefreshToken(payload: RefreshTokenPayload): Promise<string>;
    verifyAccessToken(token: string): Promise<AccessTokenPayload>;
    verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
}
