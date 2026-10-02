import { create } from "zustand";
import {
    breakdownTask,
    deleteChatSession,
    getChatSessionMessages,
    getChatSessions,
    parseTask,
    streamChat,
} from "../services/chat.service";
import {
    mapChatMessage,
    type BreakdownState,
    type ChatMessage,
    type ChatSession,
    type ParseTaskDraft,
} from "../types";

/** Abort controller của lượt stream đang chạy (ngoài state để không trigger render) */
let activeStream: AbortController | null = null;

function createId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback;
}

interface ChatState {
    sessions: ChatSession[];
    sessionsLoading: boolean;
    sessionsError: string | null;

    activeSessionId: string | null;
    messages: ChatMessage[];
    messagesLoading: boolean;

    isStreaming: boolean;
    streamError: string | null;

    draft: ParseTaskDraft | null;
    draftId: number;
    draftLoading: boolean;

    breakdown: BreakdownState | null;
    breakdownLoading: boolean;

    loadSessions: (silent?: boolean) => Promise<void>;
    startNewChat: () => void;
    selectSession: (id: string) => Promise<void>;
    removeSession: (id: string) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    retryMessage: () => Promise<void>;
    stopStreaming: () => void;
    createTaskDraft: (text: string) => Promise<void>;
    clearDraft: () => void;
    requestBreakdown: (taskId: string) => Promise<void>;
    clearBreakdown: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: [],
    sessionsLoading: false,
    sessionsError: null,

    activeSessionId: null,
    messages: [],
    messagesLoading: false,

    isStreaming: false,
    streamError: null,

    draft: null,
    draftId: 0,
    draftLoading: false,

    breakdown: null,
    breakdownLoading: false,

    loadSessions: async (silent = false) => {
        if (!silent) set({ sessionsLoading: true, sessionsError: null });
        try {
            const page = await getChatSessions(1, 20);
            set({ sessions: page.items, sessionsLoading: false });
        } catch {
            set({
                sessionsLoading: false,
                sessionsError: "Failed to load conversations",
            });
        }
    },

    startNewChat: () => {
        get().stopStreaming();
        set({
            activeSessionId: null,
            messages: [],
            streamError: null,
            draft: null,
        });
    },

    selectSession: async (id) => {
        if (get().activeSessionId === id && get().messages.length > 0) return;

        get().stopStreaming();
        set({
            activeSessionId: id,
            messages: [],
            messagesLoading: true,
            streamError: null,
            draft: null,
        });

        try {
            const page = await getChatSessionMessages(id, 1, 50);
            // BE trả mới nhất trước → reverse để hiển thị theo thời gian
            const messages = [...page.items].reverse().map(mapChatMessage);
            set({ messages, messagesLoading: false });
        } catch {
            set({
                messagesLoading: false,
                streamError: "Failed to load this conversation",
            });
        }
    },

    removeSession: async (id) => {
        const previous = get().sessions;
        const wasActive = get().activeSessionId === id;

        set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== id),
            ...(wasActive
                ? { activeSessionId: null, messages: [] as ChatMessage[] }
                : {}),
        }));

        try {
            await deleteChatSession(id);
        } catch {
            set({ sessions: previous, sessionsError: "Failed to delete conversation" });
        }
    },

    sendMessage: async (text) => {
        const message = text.trim();
        if (!message || get().isStreaming) return;

        const userMessage: ChatMessage = {
            id: createId(),
            role: "user",
            content: message,
            createdAt: new Date().toISOString(),
        };
        const assistantId = createId();
        const assistantMessage: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
            pending: true,
        };

        set((state) => ({
            messages: [...state.messages, userMessage, assistantMessage],
            isStreaming: true,
            streamError: null,
        }));

        await runAssistantStream(message, assistantId);
    },

    retryMessage: async () => {
        const { messages, isStreaming } = get();
        if (isStreaming) return;

        // Tìm lượt user gần nhất để gửi lại
        let lastUserIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "user") {
                lastUserIndex = i;
                break;
            }
        }
        if (lastUserIndex === -1) return;

        const userContent = messages[lastUserIndex].content;
        const assistantId = createId();
        const assistantMessage: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
            pending: true,
        };

        // Bỏ các bong bóng assistant lỗi sau lượt user rồi thử lại
        set({
            messages: [...messages.slice(0, lastUserIndex + 1), assistantMessage],
            isStreaming: true,
            streamError: null,
        });

        await runAssistantStream(userContent, assistantId);
    },

    stopStreaming: () => {
        if (activeStream) {
            activeStream.abort();
            activeStream = null;
        }
        if (get().isStreaming) set({ isStreaming: false });
    },

    createTaskDraft: async (text) => {
        const value = text.trim();
        if (!value || get().draftLoading) return;

        set({ draftLoading: true, streamError: null });
        try {
            const draft = await parseTask(value);
            set({ draft, draftId: get().draftId + 1, draftLoading: false });
        } catch (error) {
            set({
                draftLoading: false,
                streamError: getErrorMessage(error, "Failed to draft a task"),
            });
        }
    },

    clearDraft: () => set({ draft: null }),

    requestBreakdown: async (taskId) => {
        if (get().breakdownLoading) return;

        set({ breakdownLoading: true, breakdown: null });
        try {
            const items = await breakdownTask(taskId);
            set({ breakdown: { taskId, items }, breakdownLoading: false });
        } catch (error) {
            set({ breakdownLoading: false });
            throw new Error(getErrorMessage(error, "Failed to suggest subtasks"), {
                cause: error,
            });
        }
    },

    clearBreakdown: () => set({ breakdown: null, breakdownLoading: false }),
}));

/**
 * Chạy một lượt stream cho `assistantId` và cập nhật store.
 * Dùng chung cho gửi mới và thử lại.
 */
async function runAssistantStream(text: string, assistantId: string) {
    const controller = new AbortController();
    activeStream = controller;
    let sessionId = useChatStore.getState().activeSessionId;

    const patchAssistant = (patch: Partial<ChatMessage>) => {
        useChatStore.setState((state) => ({
            messages: state.messages.map((m) =>
                m.id === assistantId ? { ...m, ...patch } : m
            ),
        }));
    };

    try {
        await streamChat(
            text,
            sessionId,
            {
                onSession: (id) => {
                    sessionId = id;
                    useChatStore.setState({ activeSessionId: id });
                },
                onChunk: (chunk) => {
                    useChatStore.setState((state) => ({
                        messages: state.messages.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: m.content + chunk }
                                : m
                        ),
                    }));
                },
                onDone: () => {},
            },
            controller.signal
        );

        patchAssistant({ pending: false });
        useChatStore.setState({ isStreaming: false });

        // session mới/đổi updatedAt → làm mới danh sách (mới nhất lên đầu)
        await useChatStore.getState().loadSessions(true);
    } catch (error) {
        if (controller.signal.aborted) {
            // người dùng dừng — giữ phần đã stream
            const current = useChatStore
                .getState()
                .messages.find((m) => m.id === assistantId);
            patchAssistant({
                pending: false,
                content: current?.content || "Response stopped.",
            });
            useChatStore.setState({ isStreaming: false });
            return;
        }

        const errorMessage = getErrorMessage(error, "Something went wrong");
        patchAssistant({ pending: false, error: errorMessage });
        useChatStore.setState({ isStreaming: false, streamError: null });
    } finally {
        activeStream = null;
    }
}
