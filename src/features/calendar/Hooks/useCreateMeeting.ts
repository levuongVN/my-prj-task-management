import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting } from "../Services/calendar.service";

export const useCreateMeeting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
        },
    });
};