import { Calendar } from "lucide-react";
import { PROJECT_ICONS, PROJECT_STATUS_MAP, STATUS_CONFIG } from "../../../constants/projectConst";
import type { Project } from "../../types/Project";
import { formatDate } from "../../utils/dateHelper";

interface Props {
    project: Project;
    onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
    const statusKey = PROJECT_STATUS_MAP[project.status] ?? "active";
    const cfg = STATUS_CONFIG[statusKey];
    const icon = PROJECT_ICONS[Number(project.id)] ?? PROJECT_ICONS[1];

    return (
        <div
            onClick={onClick}
            className={`
                flex flex-col gap-3 rounded-2xl border-t-2 border border-white/5
                bg-[#161616] p-[18px] transition-opacity
                ${cfg.cardBorder}
                ${statusKey === "archived" ? "opacity-45" : statusKey === "completed" ? "opacity-70" : ""}
                ${onClick ? "cursor-pointer hover:bg-[#1c1c1c]" : ""}
            `}
        >
            <div className="flex items-start justify-between">
                <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-xl ${cfg.icon}`}>
                    {icon}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-zinc-100">{project.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{project.description}</p>
            </div>

            <div>
                <div className="mb-1.5 flex justify-between text-[11px]">
                    <span className="text-zinc-600">Progress</span>
                    <strong className={`font-medium ${cfg.progressText}`}>{project.progress}%</strong>
                </div>
                <div className="h-[3px] overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${cfg.progressBar}`} style={{ width: `${project.progress}%` }} />
                </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <div className={`flex items-center gap-1.5 text-[11px] ${project.overdue ? "text-red-400" : "text-zinc-600"}`}>
                    <Calendar size={12} />
                    {formatDate(project.due)}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.badge}`}>
                    {cfg.label}
                </span>
            </div>
        </div>
    );
}