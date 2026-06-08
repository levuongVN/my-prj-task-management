import { Clock, Flag, Calendar, AlertCircle } from "lucide-react";
import type { CalendarEventType } from "../shared/types/Calendar";
import React from "react";

export const EVENT_STYLES: Record<CalendarEventType, { bg: string; text: string; dot: string }> = {
    task:      { bg: "bg-blue-500/15",   text: "text-blue-400",   dot: "bg-blue-400"   },
    milestone: { bg: "bg-purple-500/15", text: "text-purple-400", dot: "bg-purple-400" },
    meeting:   { bg: "bg-teal-500/15",   text: "text-teal-400",   dot: "bg-teal-400"   },
    overdue:   { bg: "bg-red-500/15",    text: "text-red-400",    dot: "bg-red-400"    },
};

export const EVENT_ICONS: Record<CalendarEventType, React.ReactNode> = {
    task:      <Clock size={11} />,
    milestone: <Flag size={11} />,
    meeting:   <Calendar size={11} />,
    overdue:   <AlertCircle size={11} />,
};

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];