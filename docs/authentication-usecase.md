## Core Authentication Flows

- [] Sign Up / Registration (email + password, with verification) [planned]
- [] Sign In / Login [planned]
- [] Sign Out / Logout [planned]
- [] Password Reset / Forgot Password [planned]
- [] Email Verification / Account Confirmation [planned]
- [] Password Change (authenticated) [planned]
- [] Profile Management (update name, avatar, preferences) [planned]
- [] Delete / Deactivate Account (self-service) [planned]

## Token & Session Management:

- [] Access Token (header-based, usually short-lived) [planned]
- [] Refresh Token (cookie-based or httpOnly + secure) [planned]
- [] Token Rotation / Refresh Token Rotation [planned]
- [] Session Management (list active sessions, revoke specific ones) [planned]
- [] Multi-device Login / Multiple Simultaneous Sessions [planned]
- [] Single Device/Login Enforcement (kick other sessions) [planned]
- [] Revoke Session / Logout from all devices [planned]
- [] Session Lifetime / Idle Timeout Configuration [planned]
- [] Remember Me / Persistent Sessions [planned]
- [] Device Fingerprinting / Trusted Devices [planned]

## Authentication Methods & Strategies

- [] Email + Password [planned]
- [] Passwordless / Magic Link [planned]
- [] One-Time Password (OTP) via Email or SMS [planned]
- [] Passkeys / WebAuthn / FIDO2 (biometric/device-bound) [optional]
- [] Biometric Authentication (Face ID, Fingerprint – client-side) [optional]
- [] Social Login / Federated Identity (Google, Apple, GitHub, Facebook, etc.) [planned]
- [] Enterprise SSO (SAML 2.0, OIDC federation) [optional]
- [] OAuth 2.0 / OpenID Connect (as provider or consumer) [planned]
- [] Phone Number Authentication (+ OTP or magic link) [optional]

## Security & Protection Layers

- [] Two-Factor Authentication / Multi-Factor Authentication (2FA/MFA) [planned]
    - [] TOTP (Google Authenticator, Authy) [planned]
    - [] SMS OTP [optional]
    - [] Email OTP [planned]
    - [] Hardware keys (YubiKey) [optional]
    - [] Push notifications [planned]
    - [] WebAuthn as 2nd factor [optional]
- [] Adaptive / Risk-based / Contextual Authentication (step-up auth) [optional]
- [] Password Strength Policy + Breach Detection (Have I Been Pwned integration) [optional]
- [] Rate Limiting & Brute-force Protection [planned]
- [] CAPTCHA / Bot Detection (on signup/login) [planned]
- [] Anomalous Login Detection (new device, new location, impossible travel) [planned]
- [] IP Blocking / Geo-restrictions [optional]

## Authorization & Access Control

- [] Role-Based Access Control (RBAC) [planned]
- [] Permission / Scope / Claim-based Authorization [planned]
- [] Attribute-Based Access Control (ABAC) – advanced [optional]
- [] Fine-Grained Authorization (e.g. via ReBAC or external decision point like Zanzibar-inspired systems)
- [] Organizations / Teams / Multi-tenancy (B2B SaaS support) [hiatus]
    - [] Invite members
    - [] Roles per organization
    - [] Switch between organizations

## Advanced & Enterprise Features [hiatus]

- [] Single Sign-On (SSO) across multiple apps
- [] Machine-to-Machine (M2M) Authentication / Client Credentials
- [] API Authorization (OAuth for your own APIs)
- [] Custom Login / Signup / MFA Flows (via hooks, actions, rules)
- [] Customizable UI Components (pre-built or headless)
- [] Audit Logs & User Activity History
- [] Compliance Support (SOC 2, GDPR, HIPAA, ISO 27001 reports)
- [] SCIM / User Provisioning (automatic user sync from HR systems)
- [] Blocking Functions / Pre-auth Hooks (custom logic before login)
- [] Internationalization / Localization of auth screens
- [] Anonymous / Guest Authentication
- [] Custom Claims / Metadata on Tokens
- [] JWT Support (as token format)
- [] Refresh Token Revocation List / Blocklist (when needed)
