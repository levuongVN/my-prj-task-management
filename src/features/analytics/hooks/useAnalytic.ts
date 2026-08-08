import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analytics.service";

export const useAnalytics = (period = "Week", referenceDate: string) => {
    return useQuery({
        queryKey: ["analytics", period, referenceDate],
        queryFn: () => analyticsService.getAnalytics(period, referenceDate),
        staleTime: 1000 * 60 * 5,
    });
};
