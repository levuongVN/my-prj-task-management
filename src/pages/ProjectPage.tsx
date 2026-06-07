import {
    Plus,
    Search,
} from "lucide-react";
import { useProjectFilters } from "../shared/hooks/ProjectFilter";
import type { Project } from "../shared/types/Project";
import { SORT_OPTIONS, STATUS_OPTIONS } from "../constants/projectConst";
import Section from "../shared/components/project/ProjectSection";
import FilterDropdown from "../shared/components/Ui/FilterDropdown";
import SortDropdown from "../shared/components/Ui/SortDropdown";
import { useState } from "react";
import Button from "../shared/components/Ui/Button";
import Modal from "../shared/components/Ui/Modal";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProjectForm from "../shared/components/project/ProjectForm";

import {
    projectSchema,
    type ProjectFormValues,
} from "../features/project/schemals/project.schemal";

const PROJECTS: Project[] = [
    {
        id: 1,
        name: "TaskFlow Redesign",
        description: "Overhaul UI across all core screens to match new design system.",
        progress: 72,
        due: "Jun 20, 2026",
        status: "active",
        taskIds: [],
    },
    {
        id: 2,
        name: "API Integration",
        description: "Connect third-party services and build webhook endpoints.",
        progress: 40,
        due: "Jun 01, 2026",
        overdue: true,
        status: "active",
        taskIds: [],
    },
    {
        id: 3,
        name: "Analytics Dashboard",
        description: "Build reporting views for task completion and team velocity.",
        progress: 18,
        due: "Jul 15, 2026",
        status: "active",
        taskIds: [],
    },
    {
        id: 4,
        name: "User Onboarding V2",
        description: "Redesigned step-by-step flow for new sign-ups on mobile.",
        progress: 100,
        due: "May 10, 2026",
        status: "completed",
        taskIds: [],
    },
    {
        id: 5,
        name: "Auth Refactor",
        description: "Migrated auth system to JWT with refresh token rotation.",
        progress: 100,
        due: "Apr 28, 2026",
        status: "completed",
        taskIds: [],
    },
    {
        id: 6,
        name: "Legacy Import Tool",
        description: "CSV importer for old task data — replaced by new pipeline.",
        progress: 55,
        due: "Jan 15, 2026",
        status: "archived",
        taskIds: [],
    },
];



export default function ProjectsPage() {
    const {
        search,
        setSearch,
        selectedStatuses,
        setSelectedStatuses,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        clearFilters,
        byStatus,
        isEmpty,
    } = useProjectFilters(PROJECTS);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createProjectForm =
        useForm<ProjectFormValues>({
            resolver: zodResolver(projectSchema),

            defaultValues: {
                name: "",
                description: "",
                due: "",
                status: "active",
            },
        });

    const handleCreateProject = (
        data: ProjectFormValues
    ) => {
        console.log(data);

        setIsCreateOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] px-7 py-7 font-sans">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                        Project management
                    </p>
                    <h1 className="text-[22px] font-medium text-white">Your Projects</h1>
                    <p className="mt-1 text-sm text-zinc-600">Track progress across all your initiatives.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} variant="ghost" className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
                    <Plus size={14} />
                    New project
                </Button>
            </div>

            <div className="mb-7 flex gap-2">
                <div className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-white/8 bg-[#1a1a1a] px-3">
                    <Search size={14} className="text-zinc-600" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
                    />
                </div>
                <FilterDropdown
                    title="Filter Projects"
                    groups={[
                        {
                            title: "Status",

                            options: STATUS_OPTIONS,

                            selected: selectedStatuses,

                            onChange: (values) =>
                                setSelectedStatuses(
                                    values as Project["status"][]
                                ),

                            colors: {
                                active: "bg-blue-500",
                                completed: "bg-emerald-500",
                                archived: "bg-zinc-500",
                            },
                        },
                    ]}
                    onClear={clearFilters}
                />
                <SortDropdown
                    title="Sort Projects"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    options={
                        SORT_OPTIONS.map((option) => ({
                            label: option.label,
                            value: option.value,
                        }))
                    }
                    onSortByChange={
                        (value) =>
                            setSortBy(
                                value as typeof SORT_OPTIONS[number]["value"]
                            )
                    }
                    onSortOrderChange={setSortOrder}
                />
            </div>

            <Section status="active" projects={byStatus("active")} />
            <Section status="completed" projects={byStatus("completed")} />
            <Section status="archived" projects={byStatus("archived")} />

            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm text-zinc-600">No projects match your search.</p>
                </div>
            )}

            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Project"
            >
                <FormProvider {...createProjectForm}>
                    <ProjectForm onSubmit={handleCreateProject} />
                </FormProvider>
            </Modal>
        </div>

    );
}