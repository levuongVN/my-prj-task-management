import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../services/task.service";

export default function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
        },
    })
}