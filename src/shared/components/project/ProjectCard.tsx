import { Calendar, MoreHorizontal } from "lucide-react";
import { PROJECT_ICONS, STATUS_CONFIG } from "../../../constants/projectConst";
import type { Project } from "../../types/Project";

interface Props {
    project: Project;
}

export default function ProjectCard({ project }: Props) {
    const cfg = STATUS_CONFIG[project.status];
    const icon = PROJECT_ICONS[project.id];

    return (
        <div
            className={`
                flex flex-col gap-3 rounded-2xl border-t-2 border border-white/5
                bg-[#161616] p-[18px] transition-opacity
                ${cfg.cardBorder}
                ${project.status === "archived" ? "opacity-45" : project.status === "completed" ? "opacity-70" : ""}
            `}
        >
            <div className="flex items-start justify-between">
                <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-xl ${cfg.icon}`}>
                    {icon}
                </div>
                <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
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
                    {project.due}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.badge}`}>
                    {cfg.label}
                </span>
            </div>
        </div>
    );
}