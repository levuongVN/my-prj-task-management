import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../services/comment.service";

export const useUpdateComment = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateComment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", taskId],
            });
        },
    });
};
