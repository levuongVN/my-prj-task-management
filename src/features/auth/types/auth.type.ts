export interface LoadingPayload {
    email: string;
    password: string;
}

export interface RefreshTokenData {
    token: string;
    expiresAt: string;
    isRevoked: boolean;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: RefreshTokenData;
}