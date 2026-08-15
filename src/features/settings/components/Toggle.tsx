export function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onChange}
            className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 active:scale-90 ${
                enabled ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "bg-white/10 hover:bg-white/15"
            }`}
        >
            <span
                className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    enabled ? "translate-x-6" : "translate-x-0"
                }`}
            />
        </button>
    );
}
