import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubtaskResponse } from "../types/subtask.type";
import { reorderSubtasks } from "../services/subtask.service";

/**
 * Reorder với optimistic update: gửi full list id theo thứ tự mới
 * (BE tự cập nhật position toàn list), rollback về thứ tự cũ nếu lỗi.
 */
export const useReorderSubtasks = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderedIds: string[]) =>
            reorderSubtasks({ taskId, orderedSubtaskIds: orderedIds }),

        onMutate: async (orderedIds: string[]) => {
            await queryClient.cancelQueries({
                queryKey: ["subtasks", taskId],
            });

            const previousSubtasks = queryClient.getQueryData<SubtaskResponse[]>([
                "subtasks",
                taskId,
            ]);

            // Sắp lại theo thứ tự mới, giữ nguyên data
            queryClient.setQueryData<SubtaskResponse[]>(
                ["subtasks", taskId],
                (old = []) => orderedIds
                    .map((id) => old.find((s) => s.id === id))
                    .filter((s): s is SubtaskResponse => !!s)
                    .map((subtask, index) => ({ ...subtask, position: index }))
            );

            return { previousSubtasks };
        },

        onError: (_error, _orderedIds, context) => {
            if (context?.previousSubtasks) {
                queryClient.setQueryData(
                    ["subtasks", taskId],
                    context.previousSubtasks
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};
