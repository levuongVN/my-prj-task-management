import { useState } from "react";
import { Check } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { SettingCard } from "./SettingCard";
import { Toggle } from "./Toggle";

export function NotificationsSection() {
    const [notifs, setNotifs] = useState({
        taskDeadline: true,
        taskAssigned: false,
        meetingReminder: true,
        projectUpdate: false,
        weeklyDigest: true,
        soundEnabled: false,
    });

    const toggle = (key: keyof typeof notifs) =>
        setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

    const groups = [
        {
            label: "Tasks",
            items: [
                { key: "taskDeadline" as const, title: "Deadline reminders", sub: "Notify 24h before a task is due" },
                { key: "taskAssigned" as const, title: "Task assigned", sub: "When someone assigns a task to you" },
            ],
        },
        {
            label: "Meetings",
            items: [
                { key: "meetingReminder" as const, title: "Meeting reminders", sub: "15 min before a scheduled meeting" },
            ],
        },
        {
            label: "Projects",
            items: [
                { key: "projectUpdate" as const, title: "Project updates", sub: "Status changes and milestones" },
                { key: "weeklyDigest" as const, title: "Weekly digest", sub: "Summary of your week every Monday" },
            ],
        },
        {
            label: "General",
            items: [
                { key: "soundEnabled" as const, title: "Notification sounds", sub: "Play a chime for each notification" },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <SectionTitle title="Notifications" subtitle="Control what reminders and alerts you receive." />
            {groups.map((group) => (
                <SettingCard key={group.label}>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{group.label}</p>
                    <div className="space-y-1">
                        {group.items.map((item, idx) => (
                            <div key={item.key}>
                                <div className="flex items-center justify-between py-3">
                                    <div className={notifs[item.key] ? "" : "opacity-45"}>
                                        <p className={`text-sm font-medium transition-colors ${notifs[item.key] ? "text-zinc-100" : "text-zinc-500"}`}>{item.title}</p>
                                        <p className="mt-0.5 text-xs text-zinc-600">{item.sub}</p>
                                    </div>
                                    <Toggle enabled={notifs[item.key]} onChange={() => toggle(item.key)} />
                                </div>
                                {idx < group.items.length - 1 && <div className="border-t border-white/4" />}
                            </div>
                        ))}
                    </div>
                </SettingCard>
            ))}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100">
                    <Check size={15} /> Save preferences
                </button>
            </div>
        </div>
    );
}
