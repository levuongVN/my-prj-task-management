import api from "../../../shared/services/axios";
import type { UpdateUserPayload } from "../types/updateUserPayload";

export const getUserById = async function () {
    const response = await api.get(`/me`);
    return response.data;
};

export const updateUser = async function (payload: UpdateUserPayload) {
    const response = await api.put(`/me`, payload);
    return response.data;
}