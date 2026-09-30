import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLabel } from "../services/label.service";

export const useUpdateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLabel,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["labels"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
