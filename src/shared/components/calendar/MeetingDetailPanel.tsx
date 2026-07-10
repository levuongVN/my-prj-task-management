import { useState } from "react";
import { X, Pencil, Trash2, Clock, FolderKanban } from "lucide-react";
import type { Meeting } from "../../types/Meeting";
import type { ProjectOption } from "../project/ProjectSelect";
import toast from "react-hot-toast";
import axios from "axios";
import { useUpdateMeeting } from "../../../features/calendar/Hooks/useUpdateMeeting";
import { useDeleteMeeting } from "../../../features/calendar/Hooks/useDeleteMeeting";
import type { CreateMeetingFormValues } from "../../../features/calendar/schemals/event.schema";
import CreateMeetingForm from "./FormCreateMeeting";

interface Props {
    meeting: Meeting | null;
    isOpen: boolean;
    onClose: () => void;
    projects: ProjectOption[];
}

export default function MeetingDetailPanel({ meeting, isOpen, onClose, projects }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const updateMutation = useUpdateMeeting();
    const deleteMutation = useDeleteMeeting();

    const handleClose = () => {
        setIsEditing(false);
        setConfirmDelete(false);
        onClose();
    };

    const handleUpdate = (data: CreateMeetingFormValues) => {
        if (!meeting) return;

        updateMutation.mutate(
            {
                id: meeting.id,
                meetingPayload: {
                    title: data.title,
                    startAt: new Date(data.startAt).toISOString(),
                    projectId: data.projectId || null,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Meeting updated");
                    setIsEditing(false);
                },
                onError: (error) => {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.message ?? "Failed to update meeting");
                        return;
                    }
                    toast.error("Unexpected error");
                },
            }
        );
    };

    const handleDelete = () => {
        if (!meeting) return;

        deleteMutation.mutate(meeting.id, {
            onSuccess: () => {
                toast.success("Meeting deleted");
                handleClose();
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message ?? "Failed to delete meeting");
                    return;
                }
                toast.error("Unexpected error");
            },
        });
    };

    if (!meeting) return null;

    const startDate = new Date(meeting.startAt);
    const formattedDate = startDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const formattedTime = startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const linkedProject = projects.find((p) => p.id === meeting.projectId);

    // Format startAt cho form default value (datetime-local input cần "YYYY-MM-DDTHH:mm")
    const startAtLocal = meeting.startAt.substring(0, 16);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Slide-over */}
            <div
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-[#111] shadow-2xl transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
                    <div className="flex-1 pr-4">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                            Meeting detail
                        </p>
                        <h2 className="text-lg font-medium leading-snug text-white">
                            {meeting.title}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="mt-0.5 rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-white/6 hover:text-zinc-300"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {isEditing ? (
                        <CreateMeetingForm
                            defaultValues={{
                                title: meeting.title,
                                startAt: startAtLocal,
                                projectId: meeting.projectId ?? "",
                            }}
                            onSubmit={handleUpdate}
                            projects={projects}
                        />
                    ) : (
                        <div className="space-y-5">
                            {/* Start time */}
                            <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                                <div className="mb-1.5 flex items-center gap-1.5">
                                    <Clock size={11} className="text-zinc-600" />
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                        Start time
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-zinc-200">{formattedDate}</p>
                                <p className="mt-0.5 text-xs text-zinc-500">{formattedTime}</p>
                            </div>

                            {/* Project */}
                            <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                                <div className="mb-1.5 flex items-center gap-1.5">
                                    <FolderKanban size={11} className="text-zinc-600" />
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                                        Project
                                    </span>
                                </div>
                                {linkedProject ? (
                                    <p className="text-sm font-medium text-zinc-200">{linkedProject.name}</p>
                                ) : (
                                    <p className="text-sm text-zinc-600">No project</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                {!isEditing && (
                    <div className="border-t border-white/8 px-6 py-4">
                        {confirmDelete ? (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4">
                                <p className="mb-3 text-sm text-zinc-300">
                                    Delete{" "}
                                    <span className="font-medium text-white">"{meeting.title}"</span>?
                                    This can't be undone.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="flex-1 rounded-lg bg-white/6 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                                >
                                    <Pencil size={13} />
                                    Edit meeting
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/8 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-400"
                                >
                                    <Trash2 size={13} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}