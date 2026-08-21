export interface DevicePayload {
    fingerprint: string;
    pushToken: string | null;
}

export interface LoadingPayload {
    email: string;
    password: string;
    device: DevicePayload;
}

export interface RefreshTokenData {
    token: string;
    expiresAt: string;
    isRevoked: boolean;
}

export interface UserData {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    createdAt?: string;
}

export interface LoginResponse {
    accessToken: string;
    user: UserData;
    refreshToken: RefreshTokenData;
}
