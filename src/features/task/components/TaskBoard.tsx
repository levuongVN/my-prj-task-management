import { useMemo, useState } from "react";
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    type DragStartEvent, 
    type DragEndEvent 
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import { TASK_STATUS_MAP } from "../../../constants/taskOption";
import type { Task } from "../../../shared/types/Task";

interface TaskBoardProps {
    tasks: Task[];
    onStatusChange: (taskId: string, newStatus: number) => void;
    onViewTask: (task: Task) => void;
}

export default function TaskBoard({ tasks, onStatusChange, onViewTask }: TaskBoardProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = useMemo(() => {
        return Object.entries(TASK_STATUS_MAP).map(([statusId, title]) => {
            return {
                id: statusId,
                title,
                tasks: tasks.filter(t => t.status === parseInt(statusId)).sort((a, b) => a.position - b.position)
            };
        });
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === "Task") {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeTaskId = active.id as string;
        const activeTaskData = active.data.current?.task as Task;
        const overType = over.data.current?.type;

        if (!activeTaskData) return;

        let newStatus = activeTaskData.status;

        if (overType === "Column") {
            newStatus = over.data.current?.statusId;
        } else if (overType === "Task") {
            newStatus = over.data.current?.task.status;
        }

        if (activeTaskData.status !== newStatus) {
            onStatusChange(activeTaskId, newStatus);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
                {columns.map(col => (
                    <TaskColumn 
                        key={col.id} 
                        id={col.id} 
                        title={col.title} 
                        tasks={col.tasks} 
                        onViewTask={onViewTask} 
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-2 scale-105 transition-transform cursor-grabbing">
                        <TaskCard task={activeTask} onView={() => {}} isOverlay />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
