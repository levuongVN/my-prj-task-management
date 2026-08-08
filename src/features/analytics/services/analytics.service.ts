import api from "../../../shared/services/axios";
const analyticsService = {
    getAnalytics: async (period = "Week", referenceDate: string) => {
        const response = await api.get("/analytics", {
            params: { period, referenceDate },
        });
        return response.data;
    },
};

export default analyticsService;
