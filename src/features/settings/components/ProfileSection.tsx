import { useRef, useState } from "react";
import { Camera, Check, Clock, Globe, Loader2, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";
import Loading from "../../../shared/components/Ui/Loading";
import { useUser } from "../../user/hooks/useUser";
import { useUpdateUser } from "../../user/hooks/useUpdateUser";
import { uploadAvatar, deleteAvatar } from "../../user/services/user.service";
import type { UserDto } from "../../user/types/UserDto";

export function ProfileSection() {
    const { data: user, isLoading } = useUser();
    console.log("user", user);

    if (isLoading) {
        return <Loading text="Loading profile..." />;
    }

    return <ProfileForm key={user?.id} user={user} />;
}

function ProfileForm({ user }: { user?: UserDto }) {
    const [name, setName] = useState(user?.fullName ?? "");
    const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [removedAvatar, setRemovedAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateUser = useUpdateUser();

    const avatarInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? "V";

    const hasAvatarChange = avatarFile !== null || removedAvatar;
    const isDirty = name !== (user?.fullName ?? "");
    const canSave = name.trim().length > 0 && (isDirty || hasAvatarChange) && !updateUser.isPending;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            toast.error("Image must be under 1MB");
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setRemovedAvatar(false);
        e.target.value = "";
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setRemovedAvatar(true);
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            if (removedAvatar) {
                await deleteAvatar();
            } else if (avatarFile) {
                await uploadAvatar(avatarFile);
            }

            await updateUser.mutateAsync({
                Id: user.id,
                FullName: name.trim(),
            });

            toast.success("Profile updated");
        } catch {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="space-y-8">
            <SectionTitle title="Profile" subtitle="Manage your personal information and preferences." />

            <SettingCard>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Avatar</p>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        {avatarPreview || (!removedAvatar && user?.avatarUrl) ? (
                            <img
                                src={avatarPreview ?? user?.avatarUrl ?? undefined}
                                alt="Avatar"
                                className="h-20 w-20 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
                                {avatarInitial}
                            </div>
                        )}
                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700">
                            <Camera size={13} />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Upload a photo</p>
                        <p className="mt-1 text-xs text-zinc-600">PNG, JPG up to 1MB</p>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/6">Upload</button>
                            <button onClick={handleRemoveAvatar} className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:text-zinc-400">Remove</button>
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
            </SettingCard>

            <SettingCard>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Personal Information</p>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><User size={12} /> Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/6" />
                    </div>
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><Mail size={12} /> Email</label>
                        <input value={user?.email ?? ""} disabled
                            className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm text-zinc-600 outline-none" />
                        <p className="mt-1.5 text-xs text-zinc-600">Email cannot be changed.</p>
                    </div>
                </div>
            </SettingCard>

            <SettingCard>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Timezone</p>
                <p className="mb-4 text-sm text-zinc-600">Affects how deadlines and times are displayed.</p>
                <div className="relative">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/8 bg-white/4 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-white/20">
                        <option value="Asia/Ho_Chi_Minh">UTC+7 — Ho Chi Minh City</option>
                        <option value="Asia/Bangkok">UTC+7 — Bangkok</option>
                        <option value="Asia/Singapore">UTC+8 — Singapore</option>
                        <option value="America/New_York">UTC-5 — New York</option>
                        <option value="Europe/London">UTC+0 — London</option>
                        <option value="Europe/Paris">UTC+1 — Paris</option>
                    </select>
                    <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
            </SettingCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                >
                    {updateUser.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    {updateUser.isPending ? "Saving..." : "Save profile"}
                </button>
            </div>
        </div>
    );
}
