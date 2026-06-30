export interface ProjectPayload {
    name: string;
    description: string | null;
    due: string;
    status: number;
}

export interface UpdateProjectPayload {
    id: string;
    projectPayload: ProjectPayload;
}

export type ProjectStatus =| "Active"| "Completed"| "Archived";