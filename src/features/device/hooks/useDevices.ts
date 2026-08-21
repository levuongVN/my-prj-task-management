import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDevices, logoutDevice } from "../services/device.service";

export function useDevices() {
    return useQuery({
        queryKey: ["devices"],
        queryFn: getDevices,
    });
}

export function useLogoutDevice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
        },
    });
}
