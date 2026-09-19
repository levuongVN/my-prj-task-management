import { useQuery } from "@tanstack/react-query";
import { getTaskComments } from "../services/comment.service";

export const useComments = (taskId: string) => {
    return useQuery({
        queryKey: ["comments", taskId],
        queryFn: () => getTaskComments(taskId),
        enabled: !!taskId,
        staleTime: 1000 * 60, // 1 phút
    });
};
