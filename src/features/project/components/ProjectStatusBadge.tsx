import { PROJECT_STATUS_MAP, STATUS_CONFIG } from "../../../constants/projectConst";

interface Props {
    status: number;
    className?: string;
}

/**
 * Badge hiển thị trạng thái project.
 * Tự động map số (0 | 1 | 2) → label + màu sắc từ STATUS_CONFIG.
 */
export default function ProjectStatusBadge({ status, className = "" }: Props) {
    const statusKey = PROJECT_STATUS_MAP[status] ?? "active";
    const cfg = STATUS_CONFIG[statusKey];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.badge} ${className}`}
        >
            <span className={`h-[6px] w-[6px] rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}
