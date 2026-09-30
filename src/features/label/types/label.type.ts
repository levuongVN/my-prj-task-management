export interface LabelResponse {
    id: string;
    name: string;
    /** hex, vd #ef4444 */
    color: string;
}

export interface CreateLabelPayload {
    name: string;
    color: string;
}

export interface UpdateLabelPayload {
    id: string;
    labelPayload: CreateLabelPayload;
}
