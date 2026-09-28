import api from "../../../shared/services/axios";
import type { Meeting } from "../../../shared/types/Meeting";
import type { PagedResponse } from "../../../shared/types/PagedResponse";

export interface MeetingPayload {
    title: string;
    startAt: string;
    projectId?: string | null;
}

export interface UpdateMeetingPayload {
    id: string;
    meetingPayload: MeetingPayload;
}

/** BE sort: startAt giảm dần (gần nhất trước). BE tự clamp page/pageSize. */
export const getAllMeetings = async (page = 1, pageSize = 20) => {
    const response = await api.get<PagedResponse<Meeting>>("/meetings", {
        params: { page, pageSize },
    });
    return response.data;
};

export const getMeetingById = async (id: string) => {
    const response = await api.get<Meeting>(`/meetings/${id}`);
    return response.data;
};

export const createMeeting = async (payload: MeetingPayload) => {
    const response = await api.post<Meeting>("/meetings", payload);
    return response.data;
};

export const updateMeeting = async (payload: UpdateMeetingPayload) => {
    const response = await api.put<Meeting>(
        `/meetings/${payload.id}`,
        payload.meetingPayload
    );
    return response.data;
};

export const deleteMeeting = async (id: string) => {
    await api.delete(`/meetings/${id}`);
};