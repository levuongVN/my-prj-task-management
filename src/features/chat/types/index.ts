export type ChatRole = "user" | "assistant";

export const CHAT_ROLE_MAP: Record<number, ChatRole> = {
    1: "user",
    2: "assistant",
};

/** Session trả về từ GET /ai/sessions */
export interface ChatSessionDto {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export type ChatSession = ChatSessionDto;

/** Message trả về từ GET /ai/sessions/{id}/messages */
export interface ChatMessageDto {
    id: string;
    role: number;
    content: string;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: string;
    /** true khi assistant đang stream (chưa có done) */
    pending?: boolean;
    /** thông báo lỗi khi stream đứt giữa chừng */
    error?: string | null;
}

export function mapChatMessage(dto: ChatMessageDto): ChatMessage {
    return {
        id: dto.id,
        role: CHAT_ROLE_MAP[dto.role] ?? "assistant",
        content: dto.content,
        createdAt: dto.createdAt,
    };
}

/** Mỗi dòng SSE luôn có đủ 3 field: type, sessionId, text */
export type ChatStreamEvent =
    | { type: "session"; sessionId: string | null; text: null }
    | { type: "chunk"; sessionId: null; text: string }
    | { type: "done"; sessionId: null; text: null };

/** Draft task từ POST /ai/parse-task — chưa lưu DB */
export interface ParseTaskDraft {
    title: string;
    description: string | null;
    /** 0 = Low, 1 = Medium, 2 = High */
    priority: number;
    deadline: string | null;
    projectId: string | null;
    projectName: string | null;
    subtasks: string[];
}

/** Gợi ý chia nhỏ task từ POST /ai/tasks/{taskId}/breakdown — chưa lưu DB */
export interface BreakdownSuggestion {
    title: string;
    reason: string;
}

export interface BreakdownState {
    taskId: string;
    items: BreakdownSuggestion[];
}
