import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubtaskResponse } from "../types/subtask.type";
import { deleteSubtask } from "../services/subtask.service";

export const useDeleteSubtask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubtask,

        onMutate: async (subtaskId: string) => {
            const previousSubtasks = queryClient.getQueryData<SubtaskResponse[]>(["subtasks", taskId]);

            // soft delete → item biến mất khỏi list ngay
            queryClient.setQueryData<SubtaskResponse[]>(
                ["subtasks", taskId],
                (old = []) => old.filter((subtask) => subtask.id !== subtaskId)
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
            queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};
