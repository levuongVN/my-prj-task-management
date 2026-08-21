import { Monitor, Smartphone, Tablet, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useDevices, useLogoutDevice } from "../../device/hooks/useDevices";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";

const DEVICE_ICONS: Record<string, typeof Monitor> = {
    Desktop: Monitor,
    Phone: Smartphone,
    Mobile: Smartphone,
    Tablet: Tablet,
};

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}

export function DeviceSection() {
    const { data: devices = [], isLoading } = useDevices();
    const logoutDeviceMutation = useLogoutDevice();

    const handleLogoutDevice = (deviceId: string, deviceName: string) => {
        logoutDeviceMutation.mutate(deviceId, {
            onSuccess: () => {
                toast.success(`Đã đăng xuất ${deviceName}`);
            },
            onError: () => {
                toast.error("Đăng xuất thiết bị thất bại");
            },
        });
    };

    return (
        <div className="space-y-8">
            <SectionTitle
                title="Thiết bị"
                subtitle="Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn."
            />

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <Shield size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                        Thiết bị đã đăng nhập
                    </p>
                    <span className="ml-auto text-xs text-zinc-600">
                        {devices.length}/3 thiết bị
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                ) : devices.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-600">
                        Không có thiết bị nào.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {devices.map((device) => {
                            const Icon = DEVICE_ICONS[device.deviceType] || Monitor;
                            return (
                                <div
                                    key={device.id}
                                    className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
                                        device.isCurrentDevice
                                            ? "border-emerald-500/20 bg-emerald-500/5"
                                            : "border-white/6 bg-white/[0.02] hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                                        device.isCurrentDevice
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-white/5 text-zinc-400"
                                    }`}>
                                        <Icon size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-zinc-200 truncate">
                                                {device.deviceName}
                                            </p>
                                            {device.isCurrentDevice && (
                                                <span className="flex-shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                                    Thiết bị này
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-zinc-600">
                                            {device.ipAddress && `${device.ipAddress} · `}
                                            Đăng nhập {timeAgo(device.lastLoginAt)}
                                            {device.lastActiveAt !== device.lastLoginAt &&
                                                ` · Hoạt động ${timeAgo(device.lastActiveAt)}`}
                                        </p>
                                    </div>

                                    {!device.isCurrentDevice && (
                                        <button
                                            onClick={() => handleLogoutDevice(device.id, device.deviceName)}
                                            disabled={logoutDeviceMutation.isPending}
                                            className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/8 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
                                        >
                                            <LogOut size={12} />
                                            Đăng xuất
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </SettingCard>
        </div>
    );
}
