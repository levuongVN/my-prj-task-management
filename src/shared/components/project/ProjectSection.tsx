import { STATUS_CONFIG } from "../../../constants/projectConst";
import type { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";

interface Props {
    status: Project["status"];
    projects: Project[];
}

export default function Section({ status, projects }: Props) {
    if (projects.length === 0) return null;
    const cfg = STATUS_CONFIG[status];

    return (
        <div className="mb-7">
            <div className={`mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest ${cfg.sectionText}`}>
                <span className={`h-[7px] w-[7px] rounded-full ${cfg.dot}`} />
                {cfg.label}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${cfg.count}`}>{projects.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
        </div>
    );
}