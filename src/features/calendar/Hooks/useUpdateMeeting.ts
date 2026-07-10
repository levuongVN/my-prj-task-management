import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeeting } from "../Services/calendar.service";

export const useUpdateMeeting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
        },
    });
};