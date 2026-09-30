import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLabel } from "../services/label.service";

/**
 * Labels được nhúng trong TaskResponse/ProjectResponse → bất kỳ CRUD nào
 * trên label cũng phải invalidates cả 2 list để chips cập nhật.
 */
export const useCreateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLabel,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["labels"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
