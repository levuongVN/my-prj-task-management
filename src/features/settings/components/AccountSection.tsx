import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "../../user/services/user.service";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";

export function AccountSection() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const queryClient = useQueryClient();

    const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
    const tooShort = newPassword.length > 0 && newPassword.length < 6;
    const canSubmit = newPassword.length >= 6 && newPassword === confirmPassword;

    const { mutate, isPending } = useMutation({
        mutationFn: () => changePassword(newPassword),
        onSuccess: () => {
            toast.success("Password updated");
            setNewPassword("");
            setConfirmPassword("");
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => {
            toast.error("Failed to update password");
        },
    });

    const handleSubmit = () => {
        if (!canSubmit || isPending) return;
        mutate();
    };

    return (
        <div className="space-y-8">
            <SectionTitle title="Account & Security" subtitle="Manage your password and account data." />

            <SettingCard>
                <div className="mb-5 flex items-center gap-2">
                    <KeyRound size={14} className="text-zinc-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Change Password</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-400">New password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters"
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/6" />
                        {tooShort && <p className="mt-1.5 text-xs text-amber-400">Must be at least 6 characters</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-400">Confirm new password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/6" />
                        {mismatch && <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>}
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button disabled={!canSubmit || isPending} onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed">
                        {isPending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        ) : (
                            <KeyRound size={13} />
                        )}
                        {isPending ? "Updating…" : "Update password"}
                    </button>
                </div>
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
