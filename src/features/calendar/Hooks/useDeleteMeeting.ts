import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeeting } from "../Services/calendar.service";

export const useDeleteMeeting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMeeting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
        },
    });
};