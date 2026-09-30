import api from "../../../shared/services/axios";
import type {
    LabelResponse,
    CreateLabelPayload,
    UpdateLabelPayload,
} from "../types/label.type";

export const getLabels = async () => {
    const response = await api.get<LabelResponse[]>("/labels");
    return response.data;
};

export const createLabel = async function (payload: CreateLabelPayload) {
    const response = await api.post<LabelResponse>("/labels", payload);
    return response.data;
};

export const updateLabel = async function (payload: UpdateLabelPayload) {
    const response = await api.put<LabelResponse>(
        `/labels/${payload.id}`,
        payload.labelPayload
    );
    return response.data;
};

export const deleteLabel = async function (id: string) {
    await api.delete(`/labels/${id}`);
};
