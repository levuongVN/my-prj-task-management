import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analytics.service";

export const useAnalytics = (period = "Week") => {
    return useQuery({
        queryKey: ["analytics", period],
        queryFn: () => analyticsService.getAnalytics(period),
        staleTime: 1000 * 60 * 5,
    });
};