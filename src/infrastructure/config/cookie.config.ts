import { registerAs } from '@nestjs/config';

export interface CookieConfig {
    /**
     * Name of the refresh token cookie.
     * This is part of the application's authentication policy.
     */
    name: string;

    /**
     * Prevent JavaScript access to the cookie.
     */
    httpOnly: boolean;

    /**
     * Cookie path.
     */
    path: string;

    /**
     * Whether the cookie is sent only over HTTPS.
     */
    secure: boolean;

    /**
     * SameSite policy.
     */
    sameSite: 'strict' | 'lax' | 'none';

    /**
     * Optional cookie domain.
     */
    domain?: string;

    /**
     * Refresh token lifetime.
     * This intentionally mirrors JWT_REFRESH_TOKEN_EXPIRES_IN.
     * Consumers may convert it to maxAge when needed.
     */
    refreshTokenExpiresIn: string;
}

export const cookieConfig = registerAs<CookieConfig>('cookie', () => ({
    name: 'refresh_token',
    httpOnly: true,
    path: '/',
    secure: process.env.AUTH_COOKIE_SECURE === 'true',
    sameSite: (process.env.AUTH_COOKIE_SAME_SITE ?? 'lax') as CookieConfig['sameSite'],
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '7d',
}));
