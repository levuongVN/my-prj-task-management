import api, { refreshAccessToken } from "../../../shared/services/axios";
import { getAccessToken } from "../../../shared/utils/authStorage";
import type { PagedResponse } from "../../../shared/types/PagedResponse";
import type {
    BreakdownSuggestion,
    ChatMessageDto,
    ChatSessionDto,
    ChatStreamEvent,
    ParseTaskDraft,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export interface StreamChatHandlers {
    onSession: (sessionId: string) => void;
    onChunk: (text: string) => void;
    onDone: () => void;
}

function requestChat(message: string, sessionId: string | null, signal?: AbortSignal) {
    return fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            Authorization: `Bearer ${getAccessToken() ?? ""}`,
        },
        body: JSON.stringify({ sessionId, message }),
        signal,
    });
}

/**
 * POST /ai/chat — SSE streaming.
 * Dùng fetch vì EventSource không hỗ trợ POST/header.
 * - 401 (access token hết hạn) → refresh 1 lần rồi thử lại (fetch không đi
 *   qua axios interceptor nên phải tự xử lý).
 * - Lỗi validate/quota trả JSON thường (chưa mở stream) → throw message.
 * - Stream đứt trước event "done" → throw để UI cho thử lại.
 */
export async function streamChat(
    message: string,
    sessionId: string | null,
    handlers: StreamChatHandlers,
    signal?: AbortSignal
): Promise<void> {
    let response = await requestChat(message, sessionId, signal);

    if (response.status === 401) {
        await refreshAccessToken();
        response = await requestChat(message, sessionId, signal);
    }

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? `Request failed (HTTP ${response.status})`);
    }

    if (!response.body) {
        throw new Error("Streaming is not supported in this browser");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let sawDone = false;

    /** Parse 1 raw SSE event; trả về true nếu là event "done" */
    const handleRawEvent = (rawEvent: string) => {
        const dataLine = rawEvent
            .split("\n")
            .find((line) => line.startsWith("data:"));
        if (!dataLine) return false;

        const payload = dataLine.slice("data:".length).trim();
        if (!payload) return false;

        let event: ChatStreamEvent;
        try {
            event = JSON.parse(payload) as ChatStreamEvent;
        } catch {
            // bỏ qua event không parse được
            return false;
        }

        if (event.type === "session" && event.sessionId) {
            handlers.onSession(event.sessionId);
        } else if (event.type === "chunk" && event.text) {
            handlers.onChunk(event.text);
        } else if (event.type === "done") {
            handlers.onDone();
            return true;
        }
        return false;
    };

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // SSE có thể bị tách giữa 2 lần read → gom buffer, tách theo blank line
        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, "\n");

        let boundary: number;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            if (handleRawEvent(rawEvent)) return;
        }
    }

    // Event cuối có thể không có blank line theo sau
    if (buffer.trim() && handleRawEvent(buffer)) {
        sawDone = true;
    }

    if (!sawDone && !signal?.aborted) {
        throw new Error("The response was interrupted. Please try again.");
    }
}

/** GET /ai/sessions — mới nhất trước */
export async function getChatSessions(page = 1, pageSize = 20) {
    const response = await api.get<PagedResponse<ChatSessionDto>>("/ai/sessions", {
        params: { page, pageSize },
    });
    return response.data;
}

/** GET /ai/sessions/{id}/messages — mới nhất trước (page 1 = mới nhất) */
export async function getChatSessionMessages(
    sessionId: string,
    page = 1,
    pageSize = 50
) {
    const response = await api.get<PagedResponse<ChatMessageDto>>(
        `/ai/sessions/${sessionId}/messages`,
        { params: { page, pageSize } }
    );
    return response.data;
}

/** DELETE /ai/sessions/{id} → 204 */
export async function deleteChatSession(sessionId: string) {
    await api.delete(`/ai/sessions/${sessionId}`);
}

/** POST /ai/parse-task — draft, chưa lưu DB */
export async function parseTask(text: string) {
    const response = await api.post<ParseTaskDraft>("/ai/parse-task", { text });
    return response.data;
}

/** POST /ai/tasks/{taskId}/breakdown — gợi ý, chưa lưu DB */
export async function breakdownTask(taskId: string) {
    const response = await api.post<BreakdownSuggestion[]>(
        `/ai/tasks/${taskId}/breakdown`
    );
    return response.data;
}
