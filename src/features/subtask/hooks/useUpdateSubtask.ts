import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubtask } from "../services/subtask.service";

export const useUpdateSubtask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSubtask,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subtasks", taskId],
            });
        },
    });
};
