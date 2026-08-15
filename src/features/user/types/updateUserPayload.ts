export type UpdateUserPayload = { // for both update profile and password
    Id: string;
    FullName?: string;
    Email?: string;
    Password?: string;
    AvatarUrl?: string;
}