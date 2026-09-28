import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/task.service";

export const useTasks = (page = 1, pageSize = 20) => {
    return useQuery({
        queryKey: ["tasks", page, pageSize],
        queryFn: () => getAllTasks(page, pageSize),
        staleTime: 1000 * 60 * 5,
    });
};
