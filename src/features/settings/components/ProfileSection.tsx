import { useState } from "react";
import { AtSign, Camera, Check, Clock, Globe, Mail, User } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";

export function ProfileSection() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("vuongle");
    const [email] = useState("vuongle@example.com");
    const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

    return (
        <div className="space-y-8">
            <SectionTitle title="Profile" subtitle="Manage your personal information and preferences." />

            <SettingCard>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Avatar</p>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
                            V
                        </div>
                        <button className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700">
                            <Camera size={13} />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Upload a photo</p>
                        <p className="mt-1 text-xs text-zinc-600">PNG, JPG up to 2MB. Recommended 256×256.</p>
                        <div className="mt-3 flex gap-2">
                            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/6">Upload</button>
                            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:text-zinc-400">Remove</button>
                        </div>
                    </div>
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
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><AtSign size={12} /> Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/6" />
                    </div>
                    <div>
                        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400"><Mail size={12} /> Email</label>
                        <input value={email} disabled
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
                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                    <Check size={15} /> Save profile
                </button>
            </div>
        </div>
    );
}
