import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubtaskResponse } from "../types/subtask.type";
import { toggleSubtask } from "../services/subtask.service";

/**
 * Toggle checkbox với optimistic update:
 * flip isCompleted ngay trong cache để UI phản tức thì, rollback nếu lỗi.
 * (PATCH idempotent theo intent, response của BE đủ để FE khôi phục.)
 */
export const useToggleSubtask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleSubtask,

        onMutate: async (subtaskId: string) => {
            await queryClient.cancelQueries({
                queryKey: ["subtasks", taskId],
            });

            const previousSubtasks = queryClient.getQueryData<SubtaskResponse[]>([
                "subtasks",
                taskId,
            ]);

            queryClient.setQueryData<SubtaskResponse[]>(
                ["subtasks", taskId],
                (old = []) => old.map((subtask) => (
                    subtask.id === subtaskId
                        ? { ...subtask, isCompleted: !subtask.isCompleted }
                        : subtask
                ))
            );

            return { previousSubtasks };
        },

        onError: (_error, _subtaskId, context) => {
            if (context?.previousSubtasks) {
                queryClient.setQueryData(
                    ["subtasks", taskId],
                    context.previousSubtasks
                );
            }
        },

        onSettled: () => {
            // BE có thể tự đổi status task cha (Done/InProgress) → luôn refresh
            queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};
