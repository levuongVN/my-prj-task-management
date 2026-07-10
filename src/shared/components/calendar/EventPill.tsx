import { EVENT_ICONS, EVENT_STYLES } from "../../../constants/calendarConst";
import type { CalendarEvent } from "../../types/Calendar";

interface Props {
    event: CalendarEvent;
    onClick?: (event: CalendarEvent) => void;
}

export default function EventPill({ event, onClick }: Props) {
    const s = EVENT_STYLES[event.type];
    return (
        <div 
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick(event);
                }
            }}
            className={`flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[11px] font-medium cursor-pointer overflow-hidden ${s.bg} ${s.text}`}
        >
            <span className="flex-shrink-0 opacity-70">{EVENT_ICONS[event.type]}</span>
            <span className="truncate">{event.title}</span>
            {event.time && (
                <span className="ml-auto flex-shrink-0 opacity-60">{event.time}</span>
            )}
        </div>
    );
}