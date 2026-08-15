import { useQuery } from "@tanstack/react-query"
import { getUserById } from "../services/user.service"

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUserById,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}