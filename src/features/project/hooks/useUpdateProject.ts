import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../services/project.service";

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProject,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", variables.id],
            });
        },
    });
};
