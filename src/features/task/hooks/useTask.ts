import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/task.service";

export const useTasks = () => {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: getAllTasks,
        staleTime: 1000 * 60 * 5,
    });
};