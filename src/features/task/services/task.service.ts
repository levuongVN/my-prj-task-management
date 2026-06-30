import api from "../../../shared/services/axios";
import type { TaskPayload, TaskResponse,updateTaskPayload } from "../types/task.type";

export const createTask = async function (payload: TaskPayload) {
    const response = await api.post<TaskResponse>("/tasks", payload);
    return response.data;
};

export const getAllTasks = async function () {
    const response = await api.get<TaskResponse[]>("/tasks");
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