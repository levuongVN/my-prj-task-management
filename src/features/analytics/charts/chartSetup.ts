import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

export const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            titleColor: "#e4e4e7",
            bodyColor: "#a1a1aa",
            padding: 10,
            cornerRadius: 10,
        },
    },
};

export const gridColor = "rgba(255,255,255,0.04)";
export const tickColor = "#52525b";
