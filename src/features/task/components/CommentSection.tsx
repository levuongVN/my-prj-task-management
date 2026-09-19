import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../../../shared/components/Ui/Button";
import Loading from "../../../shared/components/Ui/Loading";
import { useComments } from "../../comment/hooks/useComments";
import { useCreateComment } from "../../comment/hooks/useCreateComment";
import { useUpdateComment } from "../../comment/hooks/useUpdateComment";
import { useDeleteComment } from "../../comment/hooks/useDeleteComment";
import type { CommentResponse } from "../../comment/types/comment.type";

const MAX_CONTENT_LENGTH = 2000;

interface CommentSectionProps {
    taskId: string;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
}

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

function formatRelativeTime(iso: string) {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

function CommentAvatar({ comment }: { comment: CommentResponse }) {
    if (comment.authorAvatarUrl) {
        return (
            <img
                src={comment.authorAvatarUrl}
                alt={comment.authorName}
                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
            />
        );
    }

    return (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-zinc-200">
            {getInitials(comment.authorName)}
        </span>
    );
}

export default function CommentSection({ taskId }: CommentSectionProps) {
    const { data: comments = [], isLoading } = useComments(taskId);
    const createCommentMutation = useCreateComment(taskId);
    const updateCommentMutation = useUpdateComment(taskId);
    const deleteCommentMutation = useDeleteComment(taskId);

    // userId từ claim "sub" của access token — xác định comment nào thuộc về user
    const currentUserId = (() => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return null;
            return (jwtDecode<{ sub?: string }>(token).sub ?? null);
        } catch {
            return null;
        }
    })();

    const [draft, setDraft] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingDraft, setEditingDraft] = useState("");
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

    const handleSubmit = () => {
        const content = draft.trim();
        if (!content) return;

        createCommentMutation.mutate(
            { taskId, content },
            {
                onSuccess: () => {
                    setDraft("");
                    toast.success("Comment added");
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, "Failed to add comment"));
                },
            }
        );
    };

    const handleSaveEdit = (comment: CommentResponse) => {
        const content = editingDraft.trim();
        if (!content) return;

        updateCommentMutation.mutate(
            {
                id: comment.id,
                commentPayload: { content },
            },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setEditingDraft("");
                    toast.success("Comment updated");
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, "Failed to update comment"));
                },
            }
        );
    };

    const handleDelete = (comment: CommentResponse) => {
        deleteCommentMutation.mutate(comment.id, {
            onSuccess: () => {
                setConfirmingDeleteId(null);
                toast.success("Comment deleted");
            },
            onError: (error) => {
                setConfirmingDeleteId(null);
                toast.error(getErrorMessage(error, "Failed to delete comment"));
            },
        });
    };

    const isMutating =
        createCommentMutation.isPending ||
        updateCommentMutation.isPending ||
        deleteCommentMutation.isPending;

    return (
        <section className="border-t border-white/8">
            {/* Header */}
            <div className="px-6 pt-5">
                <h3 className="text-sm font-semibold text-white">
                    Comments
                    {comments.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-zinc-500">
                            {comments.length}
                        </span>
                    )}
                </h3>
            </div>

            {/* List */}
            <div className="mt-4 max-h-[280px] overflow-y-auto px-6 space-y-4">
                {isLoading ? (
                    <Loading size={28} text="" />
                ) : comments.length === 0 ? (
                    <p className="py-6 text-center text-sm text-zinc-500">
                        No comments yet
                    </p>
                ) : (
                    comments.map((comment) => {
                        const isOwn = comment.authorId === currentUserId;
                        const isEditing = editingId === comment.id;
                        const isConfirmingDelete = confirmingDeleteId === comment.id;

                        return (
                            <div key={comment.id} className="flex gap-3">
                                <CommentAvatar comment={comment} />

                                <div className="min-w-0 flex-1">
                                    {/* Meta */}
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-semibold text-zinc-100">
                                            {comment.authorName}
                                        </span>
                                        <span className="flex-shrink-0 text-xs text-zinc-500">
                                            {formatRelativeTime(comment.createdAt)}
                                        </span>
                                        {comment.updatedAt !== comment.createdAt && (
                                            <span className="flex-shrink-0 text-[10px] italic text-zinc-600">
                                                edited
                                            </span>
                                        )}
                                    </div>

                                    {/* Body / inline edit */}
                                    {isEditing ? (
                                        <div className="mt-2">
                                            <textarea
                                                rows={3}
                                                value={editingDraft}
                                                maxLength={MAX_CONTENT_LENGTH}
                                                onChange={(e) => setEditingDraft(e.target.value)}
                                                className="w-full rounded-2xl border border-white/10 bg-black p-3 text-sm text-white outline-none resize-none focus:border-white/30"
                                            />
                                            {editingDraft.length >= MAX_CONTENT_LENGTH && (
                                                <p className="mt-1 text-xs text-amber-400">
                                                    Maximum {MAX_CONTENT_LENGTH} characters
                                                </p>
                                            )}

                                            <div className="mt-2 flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    isLoading={updateCommentMutation.isPending}
                                                    disabled={!editingDraft.trim() || isMutating}
                                                    onClick={() => handleSaveEdit(comment)}
                                                    className="rounded-xl px-3 py-1.5 text-xs"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={isMutating}
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditingDraft("");
                                                    }}
                                                    className="rounded-xl px-3 py-1.5 text-xs"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                                            {comment.content}
                                        </p>
                                    )}

                                    {/* Own comment actions */}
                                    {isOwn && !isEditing && (
                                        <div className="mt-1.5 flex items-center gap-3">
                                            {isConfirmingDelete ? (
                                                <>
                                                    <span className="text-xs text-zinc-500">
                                                        Delete this comment?
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(comment)}
                                                        className="text-xs font-semibold text-red-400 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmingDeleteId(null)}
                                                        className="text-xs text-zinc-400 hover:text-zinc-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingId(comment.id);
                                                            setEditingDraft(comment.content);
                                                        }}
                                                        className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-300"
                                                    >
                                                        <Pencil size={11} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmingDeleteId(comment.id)}
                                                        className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-red-400"
                                                    >
                                                        <Trash2 size={11} />
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Composer */}
            <div className="mt-4 border-t border-white/8 p-4">
                <textarea
                    rows={2}
                    value={draft}
                    maxLength={MAX_CONTENT_LENGTH}
                    placeholder="Add a comment..."
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black p-3 text-sm text-white outline-none resize-none focus:border-white/30"
                />

                <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs ${draft.length >= MAX_CONTENT_LENGTH ? "text-amber-400" : "text-zinc-500"}`}>
                        {draft.length}/{MAX_CONTENT_LENGTH}
                    </span>

                    <Button
                        type="button"
                        size="sm"
                        isLoading={createCommentMutation.isPending}
                        disabled={!draft.trim() || isMutating}
                        onClick={handleSubmit}
                        className="rounded-xl px-4 py-2 text-xs"
                    >
                        Comment
                    </Button>
                </div>
            </div>
        </section>
    );
}
