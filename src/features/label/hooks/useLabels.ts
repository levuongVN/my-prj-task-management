import { useQuery } from "@tanstack/react-query";
import { getLabels } from "../services/label.service";

export const useLabels = () => {
    return useQuery({
        queryKey: ["labels"],
        queryFn: getLabels,
        staleTime: 1000 * 60, // 1 phút
    });
};
