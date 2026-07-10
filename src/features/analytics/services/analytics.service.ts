import api from "../../../shared/services/axios";
const analyticsService = {
    getAnalytics: async (period = "Week") => {
        const response = await api.get(
            `/analytics?period=${period}`
        );
        return response.data;
    },
};

export default analyticsService;