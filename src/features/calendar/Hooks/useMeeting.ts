import { useQuery } from "@tanstack/react-query";
import { getAllMeetings } from "../Services/calendar.service";

export const useMeetings = (page = 1, pageSize = 20) => {
    return useQuery({
        queryKey: ["meetings", page, pageSize],
        queryFn: () => getAllMeetings(page, pageSize),
        staleTime: 1000 * 60 * 5, // 5 phút
    });
};
