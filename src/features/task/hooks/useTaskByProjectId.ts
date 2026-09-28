import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "../services/task.service";

export const useTaskByProjectId = (projectId?: string) => {
    return useQuery({
        // pageSize 100 để lấy trọn list của 1 project (modal/subtask context)
        queryKey: ["tasks", "project", projectId, 1, 100],
        queryFn: () => getTasksByProject(projectId!, 1, 100),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5,
    });
};
