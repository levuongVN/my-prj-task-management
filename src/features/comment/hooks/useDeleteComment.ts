import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../services/comment.service";

export const useDeleteComment = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", taskId],
            });
        },
    });
};
