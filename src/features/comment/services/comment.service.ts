import api from "../../../shared/services/axios";
import type {
    CommentResponse,
    CreateCommentPayload,
    UpdateCommentPayload,
} from "../types/comment.type";

export const getTaskComments = async function (taskId: string) {
    const response = await api.get<CommentResponse[]>(`/comments/task/${taskId}`);
    return response.data;
};

export const createComment = async function (payload: CreateCommentPayload) {
    const response = await api.post<CommentResponse>("/comments", payload);
    return response.data;
};

export const updateComment = async function (payload: UpdateCommentPayload) {
    const response = await api.put<CommentResponse>(
        `/comments/${payload.id}`,
        payload.commentPayload
    );
    return response.data;
};

export const deleteComment = async function (id: string) {
    await api.delete(`/comments/${id}`);
};
