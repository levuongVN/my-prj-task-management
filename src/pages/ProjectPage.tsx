import {
    Plus,
    Search,
} from "lucide-react";
import { useProjectFilters } from "../shared/hooks/ProjectFilter";
import type { Project } from "../shared/types/Project";
import { PROJECT_STATUS_REVERSE, SORT_OPTIONS, STATUS_OPTIONS } from "../constants/projectConst";
import Section from "../shared/components/project/ProjectSection";
import FilterDropdown from "../shared/components/Ui/FilterDropdown";
import SortDropdown from "../shared/components/Ui/SortDropdown";
import { useState } from "react";
import Button from "../shared/components/Ui/Button";
import Modal from "../shared/components/Ui/Modal";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProjectForm from "../shared/components/project/ProjectForm";
import ProjectDetailPanel from "../shared/components/project/ProjectDetailPanel";

import {
    projectSchema,
    type ProjectFormValues,
} from "../features/project/schemals/project.schemal";
import { useProjects } from "../features/project/hooks/useProjects";
import { useCreateProject } from "../features/project/hooks/useCreateProject";
import { useUpdateProject } from "../features/project/hooks/useUpdateProject";
import { useDeleteProject } from "../features/project/hooks/useDeleteProject";
import toast from "react-hot-toast";

export default function ProjectsPage() {
    // ── Fetch từ API ──────────────────────────────────────
    const { data: rawProjects = [], isLoading } = useProjects();
    const createProjectMutation = useCreateProject();
    const updateProjectMutation = useUpdateProject();
    const deleteProjectMutation = useDeleteProject();

    const projects: Project[] = rawProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? undefined,
        status: p.status,
        due: p.due,
        progress: p.progress,
        overdue: new Date(p.due) < new Date() && p.status !== 1,
        taskIds: [],
    }));

    // ── Filter / Sort ─────────────────────────────────────
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
    } = useProjectFilters(projects);

    // ── Detail panel ──────────────────────────────────────
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleOpenDetail = (project: Project) => {
        setSelectedProject(project);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        setTimeout(() => setSelectedProject(null), 300); // chờ animation đóng xong
    };

    // ── Edit modal ────────────────────────────────────────
    const [isEditOpen, setIsEditOpen] = useState(false);
    const editProjectForm = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
    });

    const handleOpenEdit = (project: Project) => {
        const statusKey = Object.entries(PROJECT_STATUS_REVERSE).find(
            ([, v]) => v === project.status
        )?.[0] as ProjectFormValues["status"] | undefined;

        editProjectForm.reset({
            name: project.name,
            description: project.description ?? "",
            due: project.due.split("T")[0],
            status: statusKey ?? "active",
        });
        setIsEditOpen(true);
    };

    const handleEditProject = (
        data: ProjectFormValues
    ) => {
        if (!selectedProject) return;

        updateProjectMutation.mutate(
            {
                id: selectedProject.id,
                projectPayload: {
                    name: data.name,
                    description: data.description ?? null,
                    due: new Date(data.due).toISOString(),
                    status: PROJECT_STATUS_REVERSE[data.status],
                },
            },
            {
                onSuccess: () => {
                    toast.success("Project updated");

                    setIsEditOpen(false);
                },

                onError: () => {
                    toast.error("Failed to update project");
                },
            }
        );
    };

    // ── Delete ────────────────────────────────────────────
    const handleDeleteProject = (project: Project) => {
        deleteProjectMutation.mutate(project.id, {
            onSuccess: () => {
                handleCloseDetail()
                toast.success("Project deleted successfully");
            },
            onError: () => {
                toast.error("Failed to delete project");
            },
        });
    };

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createProjectForm = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            due: "",
            status: "active",
        },
    });

    const handleCreateProject = (data: ProjectFormValues) => {
        createProjectMutation.mutate(
            {
                name: data.name,
                description: data.description ?? null,
                due: new Date(data.due).toISOString(),
                status: PROJECT_STATUS_REVERSE[data.status],
            },
            {
                onSuccess: () => {
                    toast.success("Project created successfully");

                    createProjectForm.reset();
                    setIsCreateOpen(false);
                },

                onError: () => {
                    toast.error("Failed to create project");
                },
            }
        );
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
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    variant="ghost"
                    className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
                >
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
                            options: [...STATUS_OPTIONS],
                            selected: selectedStatuses.map((n) =>
                                STATUS_OPTIONS[n] ?? STATUS_OPTIONS[0]
                            ),
                            onChange: (values) =>
                                setSelectedStatuses(
                                    (values as string[]).map(
                                        (v) => STATUS_OPTIONS.indexOf(v as typeof STATUS_OPTIONS[number])
                                    ).filter((n) => n !== -1)
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

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-zinc-600">Loading projects...</p>
                </div>
            ) : (
                <>
                    <Section status={0} projects={byStatus(0)} onProjectClick={handleOpenDetail} />
                    <Section status={1} projects={byStatus(1)} onProjectClick={handleOpenDetail} />
                    <Section status={2} projects={byStatus(2)} onProjectClick={handleOpenDetail} />

                    {isEmpty && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-sm text-zinc-600">No projects match your search.</p>
                        </div>
                    )}
                </>
            )}

            {/* Create */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Project"
            >
                <FormProvider {...createProjectForm}>
                    <ProjectForm onSubmit={handleCreateProject} />
                </FormProvider>
            </Modal>

            {/* Edit */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Project"

            >
                <FormProvider {...editProjectForm}>
                    <ProjectForm isEdit={true} onSubmit={handleEditProject} />
                </FormProvider>
            </Modal>

            {/* Detail panel */}
            <ProjectDetailPanel
                project={selectedProject}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteProject}
            />
        </div>
    );
}