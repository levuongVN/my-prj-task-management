import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../services/project.service";

export const useProjectById = (id: string) => {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: () => getProjectById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
