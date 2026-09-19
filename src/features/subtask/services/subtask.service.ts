import api from "../../../shared/services/axios";
import type {
    SubtaskResponse,
    CreateSubtaskPayload,
    ReorderSubtasksPayload,
    UpdateSubtaskPayload,
} from "../types/subtask.type";

export const getTaskSubtasks = async function (taskId: string) {
    const response = await api.get<SubtaskResponse[]>(`/subtasks/task/${taskId}`);
    return response.data;
};

export const createSubtask = async function (payload: CreateSubtaskPayload) {
    const response = await api.post<SubtaskResponse>("/subtasks", payload);
    return response.data;
};

export const updateSubtask = async function (payload: UpdateSubtaskPayload) {
    const response = await api.put<SubtaskResponse>(
        `/subtasks/${payload.id}`,
        payload.subtaskPayload
    );
    return response.data;
};

export const toggleSubtask = async function (id: string) {
    const response = await api.patch<SubtaskResponse>(
        `/subtasks/${id}/toggle`
    );
    return response.data;
};

export const reorderSubtasks = async function (payload: ReorderSubtasksPayload) {
    const response = await api.put<SubtaskResponse[]>(
        `/subtasks/task/${payload.taskId}/reorder`,
        payload
    );
    return response.data;
};

export const deleteSubtask = async function (id: string) {
    await api.delete(`/subtasks/${id}`);
};
