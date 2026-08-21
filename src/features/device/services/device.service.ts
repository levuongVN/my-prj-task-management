import api from "../../../shared/services/axios";
import type { Device } from "../types";

export async function getDevices(): Promise<Device[]> {
    const response = await api.get<Device[]>("/me/devices");
    return response.data;
}

export async function logoutDevice(deviceId: string): Promise<void> {
    await api.delete(`/me/devices/${deviceId}`);
}
