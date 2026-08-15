import { useProjectFilters } from '../shared/hooks/ProjectFilter';
import type { Project } from '../shared/types/Project';
import { PROJECT_STATUS_REVERSE } from '../constants/projectConst';
import Section from '../features/project/components/ProjectSection';
import { useState } from 'react';
import Modal from '../shared/components/Ui/Modal';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProjectForm from '../features/project/components/ProjectForm';
import ProjectDetailPanel from '../features/project/components/ProjectDetailPanel';

import {
    projectSchema,
    type ProjectFormValues,
} from '../features/project/schemals/project.schemal';
import { useProjects } from '../features/project/hooks/useProjects';
import { useCreateProject } from '../features/project/hooks/useCreateProject';
import { useUpdateProject } from '../features/project/hooks/useUpdateProject';
import { useDeleteProject } from '../features/project/hooks/useDeleteProject';
import toast from 'react-hot-toast';

import { ProjectPageHeader } from '../features/project/components/ProjectPageHeader';
import { ProjectToolbar } from '../features/project/components/ProjectToolbar';

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
            <ProjectPageHeader onCreate={() => setIsCreateOpen(true)} />

            <ProjectToolbar
                search={search}
                onSearchChange={setSearch}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                onClearFilters={clearFilters}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={(v) => setSortBy(v as "name" | "due" | "progress" | "status")}
                onSortOrderChange={setSortOrder}
            />

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
                    <ProjectForm isLoading={createProjectMutation.isPending} onSubmit={handleCreateProject} />
                </FormProvider>
            </Modal>

            {/* Edit */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Project"

            >
                <FormProvider {...editProjectForm}>
                    <ProjectForm isEdit={true} isLoading={updateProjectMutation.isPending} onSubmit={handleEditProject} />
                </FormProvider>
            </Modal>

            {/* Detail panel */}
            <ProjectDetailPanel
                project={selectedProject}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteProject}
                isLoading={deleteProjectMutation.isPending}
            />
        </div>
    );
}
