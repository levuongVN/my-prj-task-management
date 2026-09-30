import api from "../../../shared/services/axios";
import type { TaskPayload, TaskResponse,updateTaskPayload } from "../types/task.type";
import type { PagedResponse } from "../../../shared/types/PagedResponse";

export const createTask = async function (payload: TaskPayload) {
    const response = await api.post<TaskResponse>("/tasks", payload);
    return response.data;
};

/** BE sort: createdAt giảm dần (mới trước). BE tự clamp page/pageSize. */
export const getAllTasks = async function (page = 1, pageSize = 20, labelId?: string) {
    const response = await api.get<PagedResponse<TaskResponse>>("/tasks", {
        params: { page, pageSize, ...(labelId ? { labelId } : {}) },
    });
    return response.data;
}

export const getTaskById = async function (id: string) {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
};

export const updateTask = async function (payload: updateTaskPayload) {
    const response = await api.put<TaskResponse>(`/tasks/${payload.id}`, payload.taskPayload);
    return response.data;
};

export const deleteTask = async function (id: string) {
    await api.delete(`/tasks/${id}`);
};

/** BE sort: position tăng dần (thứ tự board/kanban) */
export const getTasksByProject = async function (projectId: string, page = 1, pageSize = 20) {
    const response = await api.get<PagedResponse<TaskResponse>>(`/tasks/project/${projectId}`, {
        params: { page, pageSize },
    });
    return response.data;
};