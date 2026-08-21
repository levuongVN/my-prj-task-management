export interface Device {
    id: string;
    deviceType: string;
    deviceName: string;
    ipAddress: string | null;
    lastActiveAt: string;
    lastLoginAt: string;
    isActive: boolean;
    isCurrentDevice: boolean;
}
