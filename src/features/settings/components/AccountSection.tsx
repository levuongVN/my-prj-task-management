import { useState } from "react";
import { Globe, Lock, LogOut, Trash2 } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";

export function AccountSection() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="space-y-8">
            <SectionTitle title="Account & Security" subtitle="Manage your password and account data." />

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <Lock size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Change Password</p>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "Current password", value: currentPassword, set: setCurrentPassword },
                        { label: "New password",     value: newPassword,     set: setNewPassword },
                        { label: "Confirm new password", value: confirmPassword, set: setConfirmPassword },
                    ].map(({ label, value, set }) => (
                        <div key={label}>
                            <label className="mb-2 block text-xs font-medium text-zinc-400">{label}</label>
                            <input type="password" value={value} onChange={(e) => set(e.target.value)} placeholder="••••••••"
                                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/6" />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                        <Lock size={13} /> Update password
                    </button>
                </div>
            </SettingCard>

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <Globe size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Active Session</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-zinc-200">Current device</p>
                        <p className="mt-0.5 text-xs text-zinc-600">Ho Chi Minh City · Chrome on macOS</p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                    </span>
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/15 hover:text-zinc-200">
                    <LogOut size={14} /> Sign out of all devices
                </button>
            </SettingCard>

            <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-6">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-red-400/70">Danger Zone</p>
                <p className="mb-5 text-sm text-zinc-600">These actions are irreversible. Proceed with caution.</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Delete account</p>
                        <p className="mt-0.5 text-xs text-zinc-600">Permanently remove all your data.</p>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20">
                        <Trash2 size={13} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
