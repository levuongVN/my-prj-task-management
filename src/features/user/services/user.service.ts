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
export const uploadAvatar = async (
    file: File
): Promise<UserDto> => {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await api.post<UserDto>(
        "/me/avatar",
        formData
    );

    return response.data;
};

export const deleteAvatar = async (): Promise<UserDto> => {
    const response = await api.delete<UserDto>("/me/avatar");
    return response.data;
};

export const changePassword = async (newPassword: string): Promise<void> => {
    await api.put("/me/update/password", { NewPassword: newPassword });
};