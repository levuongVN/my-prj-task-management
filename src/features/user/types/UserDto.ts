export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    /** null = chưa verify email; ISO date = đã verify */
    emailVerifiedAt?: string | null;
    createdAt?: string | null;
}
