import api from "../../../shared/services/axios";
import type { UserDto } from "../types/UserDto";
import type { UpdateUserPayload } from "../types/updateUserPayload";

export const getUserById = async (): Promise<UserDto> => {
    const response = await api.get<UserDto>(`/me`);
    return response.data;
};

export const updateUser = async function (payload: UpdateUserPayload) {
    const response = await api.put(`/me/update`, payload);
    return response.data;
}