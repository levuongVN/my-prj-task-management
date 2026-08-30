import { useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNotificationStore } from "../../notification/store/notificationStore";
import type { NotificationDto } from "../types";

const HUB_URL = `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}/hubs/notification`;

export function useNotificationRealtime() {
    const prependNotification = useNotificationStore((s) => s.prependNotification);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () =>
                    localStorage.getItem("accessToken") ?? "",
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connection.on("NotificationReceived", (data: NotificationDto) => {
            prependNotification(data);
        });

        connection
            .start()
            .catch((err) => {
                console.error("SignalR connection failed:", err);
            });

        return () => {
            connection.stop().catch(() => {
                // ignore stop errors on unmount
            });
        };
    }, [prependNotification]);
}
