import { ToggleLeft, ToggleRight } from "lucide-react";

export function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button onClick={onChange} className="relative flex-shrink-0">
            {enabled ? (
                <ToggleRight size={40} className="text-white" strokeWidth={1.5} />
            ) : (
                <ToggleLeft size={40} className="text-zinc-600" strokeWidth={1.5} />
            )}
        </button>
    );
}
