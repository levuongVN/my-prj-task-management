import { useState } from "react";
import type { SettingSection } from "../features/settings/types";
import { AppearanceSection } from "../features/settings/components/AppearanceSection";
import { ProfileSection } from "../features/settings/components/ProfileSection";
import { NotificationsSection } from "../features/settings/components/NotificationsSection";
import { AccountSection } from "../features/settings/components/AccountSection";
import { SettingsNavigation } from "../features/settings/components/SettingsNavigation";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingSection>("appearance");

    const renderSection = () => {
        switch (activeSection) {
            case "appearance":    return <AppearanceSection />;
            case "profile":       return <ProfileSection />;
            case "notifications": return <NotificationsSection />;
            case "account":       return <AccountSection />;
        }
    };

    return (
        <div className="min-h-screen text-white">
            <div className="mb-8">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">Configuration</p>
                <h1 className="text-[22px] font-medium text-white">Settings</h1>
                <p className="mt-1 text-sm text-zinc-600">Customize your workspace to fit your workflow.</p>
            </div>

            <div className="flex gap-8">
                <SettingsNavigation activeSection={activeSection} onSelect={setActiveSection} />

                {/* Main content */}
                <main className="min-w-0 flex-1">{renderSection()}</main>
            </div>
        </div>
    );
}
