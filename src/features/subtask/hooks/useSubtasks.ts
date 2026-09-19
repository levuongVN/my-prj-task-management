import { useQuery } from "@tanstack/react-query";
import { getTaskSubtasks } from "../services/subtask.service";

export const useSubtasks = (taskId: string) => {
    return useQuery({
        queryKey: ["subtasks", taskId],
        queryFn: () => getTaskSubtasks(taskId),
        enabled: !!taskId,
        staleTime: 1000 * 60, // 1 phút
    });
};
