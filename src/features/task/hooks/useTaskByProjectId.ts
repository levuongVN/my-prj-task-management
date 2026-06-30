import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "../services/task.service";

export const useTaskByProjectId = (projectId?: string) => {
    return useQuery({
        queryKey: ["tasks", "project", projectId],
        queryFn: () => getTasksByProject(projectId!),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5,
    });
};