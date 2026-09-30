import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLabel } from "../services/label.service";

/**
 * BE tự gỡ label khỏi mọi task/project (204) → chỉ cần invalidate cả 3 key.
 */
export const useDeleteLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLabel,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["labels"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
