export interface TokenPayload {
    sub: string;
    email: string;
    roles?: string[];
    permissions?: string[];
    sessionId?: string;
}

export interface ITokenService {
    generateAccessToken(payload: TokenPayload): string;
    generateRefreshToken(): string;
    verifyAccessToken(token: string): TokenPayload;
    verifyRefreshToken(token: string): boolean;
}
