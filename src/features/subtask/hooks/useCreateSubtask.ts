import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubtask } from "../services/subtask.service";

export const useCreateSubtask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubtask,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subtasks", taskId],
            });
            // TaskResponse chứa subtasks + progressPercent → refresh danh sách task
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};
