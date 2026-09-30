import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/task.service";

export const useTasks = (page = 1, pageSize = 20, labelId?: string) => {
    return useQuery({
        // queryKey include labelId — server-side filter theo nhãn
        queryKey: ["tasks", page, pageSize, labelId ?? null],
        queryFn: () => getAllTasks(page, pageSize, labelId),
        staleTime: 1000 * 60 * 5,
    });
};
