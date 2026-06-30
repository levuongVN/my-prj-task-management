import { PROJECT_STATUS_MAP, STATUS_CONFIG } from "../../../constants/projectConst";

interface Props {
    status: number;
    progress: number;
    className?: string;
}

/**
 * Progress bar có màu theo status project.
 * Tự động map số (0 | 1 | 2) → màu từ STATUS_CONFIG.
 */
export default function ProjectProgressBar({ status, progress, className = "" }: Props) {
    const statusKey = PROJECT_STATUS_MAP[status] ?? "active";
    const cfg = STATUS_CONFIG[statusKey];
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className={className}>
            <div className="mb-1.5 flex justify-between text-[11px]">
                <span className="text-zinc-600">Progress</span>
                <strong className={`font-medium ${cfg.progressText}`}>
                    {clampedProgress}%
                </strong>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.progressBar}`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
}
