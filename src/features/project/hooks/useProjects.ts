import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../services/project.service";

export const useProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
        staleTime: 1000 * 60 * 5,
    });
};
