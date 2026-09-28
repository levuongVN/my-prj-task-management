import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../services/project.service";

export const useProjects = (page = 1, pageSize = 20) => {
    return useQuery({
        queryKey: ["projects", page, pageSize],
        queryFn: () => getAllProjects(page, pageSize),
        staleTime: 1000 * 60 * 5,
    });
};
