export interface DevicePayload {
    fingerprint: string;
    pushToken: string | null;
}

export interface LoadingPayload {
    email: string;
    password: string;
    device: DevicePayload;
}

export interface GoogleLoginPayload {
    idToken: string;
    device: DevicePayload;
}

export interface GithubLoginPayload {
    code: string;
    device: DevicePayload;
}

export interface RefreshTokenData {
    token: string;
    expiresAt: string;
    isRevoked: boolean;
}

export interface LogoutPayload {
    refreshToken: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    device?: DevicePayload;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export interface MessageResponse {
    message: string;
}

export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    emailVerifiedAt?: string | null;
    createdAt?: string | null;
}

export interface UserData {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    /** null = chưa verify email; ISO date = đã verify (OAuth tự verify) */
    emailVerifiedAt?: string | null;
    createdAt?: string;
}

export interface VerifyEmailPayload {
    token: string;
}

export interface ResendVerificationPayload {
    email: string;
}

export interface LoginResponse {
    accessToken: string;
    user: UserData;
    refreshToken: RefreshTokenData;
}
