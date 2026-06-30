import api from "../../../shared/services/axios";
import type { ProjectPayload, UpdateProjectPayload } from "../types/projectPayload";
import type { ProjectResponse } from "../types/projectResponse";

export const getAllProjects = async () => {
    const response = await api.get<ProjectResponse[]>("/projects");

    return response.data;
};

export const getProjectById = async (id: string) => {
    const response = await api.get<ProjectResponse>(
            `/projects/${id}`
        );

    return response.data;
};

export const createProject = async (payload: ProjectPayload) => {
    const response =await api.post<ProjectResponse>(
            "/projects",
            payload
        );
    return response.data;
};

export const updateProject = async (payload: UpdateProjectPayload) => {
    const response = await api.put<ProjectResponse>(`/projects/${payload.id}`,
            payload.projectPayload
        );
    return response.data;
};

export const deleteProject = async (id: string) => {
    await api.delete(`/projects/${id}`);
};