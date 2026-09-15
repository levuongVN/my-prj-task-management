import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Folder, ListTodo, Search, X } from "lucide-react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useTasks } from "../../task/hooks/useTask";
import { useProjects } from "../../project/hooks";
import { TASK_STATUS_MAP } from "../../../constants/taskOption";
import type { TaskResponse } from "../../task/types/task.type";
import type { ProjectResponse } from "../../project/types/projectResponse";

type Entry =
    | { kind: "task"; item: TaskResponse }
    | { kind: "project"; item: ProjectResponse };

const MAX_TASKS = 5;
const MAX_PROJECTS = 3;

function rank(text: string, query: string) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) return null;
    // Starts-with matches rank higher than mid-string matches
    return { score: index === 0 ? 0 : 1, index };
}

function Highlighted({ text, query }: { text: string; query: string }) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);
    if (!query || index === -1) return <span>{text}</span>;

    return (
        <span>
            {text.slice(0, index)}
            <span className="font-semibold text-white">
                {text.slice(index, index + lowerQuery.length)}
            </span>
            {text.slice(index + lowerQuery.length)}
        </span>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const debouncedQuery = useDebouncedValue(query, 250);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { data: tasks = [] } = useTasks();
    const { data: projects = [] } = useProjects();

    // Cmd/Ctrl + K focuses the search from anywhere
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close on outside click / Escape
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const results = useMemo(() => {
        if (!debouncedQuery.trim()) return { tasks: [], projects: [] } as const;

        const taskMatches = tasks
            .map((task) => ({ task, rank: rank(task.title, debouncedQuery) }))
            .filter((t): t is { task: TaskResponse; rank: { score: number; index: number } } => t.rank !== null)
            .sort((a, b) => a.rank.score - b.rank.score)
            .slice(0, MAX_TASKS);

        const projectMatches = projects
            .map((project) => ({ project, rank: rank(project.name, debouncedQuery) }))
            .filter((p): p is { project: ProjectResponse; rank: { score: number; index: number } } => p.rank !== null)
            .sort((a, b) => a.rank.score - b.rank.score)
            .slice(0, MAX_PROJECTS);

        return { tasks: taskMatches, projects: projectMatches } as const;
    }, [debouncedQuery, tasks, projects]);

    const entries: Entry[] = useMemo(() => ([
        ...results.tasks.map<Entry>((match) => ({ kind: "task", item: match.task })),
        ...results.projects.map<Entry>((match) => ({ kind: "project", item: match.project })),
    ]), [results]);

    // Reset the selection when the debounced query changes (during render)
    const [prevQuery, setPrevQuery] = useState(debouncedQuery);
    if (prevQuery !== debouncedQuery) {
        setPrevQuery(debouncedQuery);
        setActiveIndex(0);
    }

    // Scroll the active option into view
    useEffect(() => {
        if (!open || entries.length === 0) return;
        document
            .querySelector(`[data-search-index="${activeIndex}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, open, entries.length]);

    const handleSelect = (entry: Entry) => {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
        navigate(
            entry.kind === "task"
                ? `/tasks?taskId=${entry.item.id}`
                : `/projects?projectId=${entry.item.id}`
        );
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (entries.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((prev) => (prev + 1) % entries.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + entries.length) % entries.length);
        } else if (e.key === "Enter") {
            const entry = entries[activeIndex];
            if (entry) {
                e.preventDefault();
                handleSelect(entry);
            }
        }
    };

    const hasQuery = debouncedQuery.trim().length > 0;
    const noResults = hasQuery && entries.length === 0;

    return (
        <div ref={wrapperRef} className="relative hidden md:block">
            <div
                className={`flex items-center gap-3 h-14 px-5 rounded-2xl bg-white/5 border transition min-w-[280px] lg:min-w-[320px] ${
                    open ? "border-white/20" : "border-white/5"
                }`}
            >
                <Search size={18} className="flex-shrink-0 text-zinc-500" />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Search tasks, projects..."
                    className="bg-transparent outline-none text-sm flex-1 placeholder:text-zinc-500 text-white"
                />
                {query ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 hover:bg-white/10 hover:text-zinc-300 transition"
                    >
                        <X size={13} />
                    </button>
                ) : (
                    <kbd className="hidden lg:flex items-center gap-0.5 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                        ⌘K
                    </kbd>
                )}
            </div>

            {open && hasQuery && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40 overflow-hidden">
                    {noResults ? (
                        <div className="flex flex-col items-center gap-2 px-4 py-10 text-zinc-500">
                            <Search size={28} strokeWidth={1.2} />
                            <p className="text-sm">No results for “{debouncedQuery.trim()}”</p>
                        </div>
                    ) : (
                        <div className="max-h-[380px] overflow-y-auto p-2">
                            {results.tasks.length > 0 && (
                                <>
                                    <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                        Tasks
                                    </p>
                                    {results.tasks.map(({ task }) => {
                                        const index = entries.findIndex(
                                            (entry) => entry.kind === "task" && entry.item.id === task.id
                                        );
                                        return (
                                            <button
                                                key={task.id}
                                                type="button"
                                                data-search-index={index}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => handleSelect({ kind: "task", item: task })}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                                    activeIndex === index ? "bg-white/10" : ""
                                                }`}
                                            >
                                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                                                    <ListTodo size={15} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm text-zinc-100">
                                                        <Highlighted text={task.title} query={debouncedQuery} />
                                                    </span>
                                                    <span className="text-[11px] text-zinc-500">
                                                        {TASK_STATUS_MAP[task.status] ?? "Task"}
                                                        {task.deadline ? ` · Due ${formatDate(task.deadline)}` : ""}
                                                    </span>
                                                </span>
                                                {activeIndex === index && (
                                                    <Check size={14} className="flex-shrink-0 text-zinc-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </>
                            )}

                            {results.projects.length > 0 && (
                                <>
                                    <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                        Projects
                                    </p>
                                    {results.projects.map(({ project }) => {
                                        const index = entries.findIndex(
                                            (entry) => entry.kind === "project" && entry.item.id === project.id
                                        );
                                        return (
                                            <button
                                                key={project.id}
                                                type="button"
                                                data-search-index={index}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => handleSelect({ kind: "project", item: project })}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                                    activeIndex === index ? "bg-white/10" : ""
                                                }`}
                                            >
                                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                                                    <Folder size={15} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm text-zinc-100">
                                                        <Highlighted text={project.name} query={debouncedQuery} />
                                                    </span>
                                                    <span className="text-[11px] text-zinc-500">
                                                        {Math.round(project.progress)}% complete
                                                    </span>
                                                </span>
                                                {activeIndex === index && (
                                                    <Check size={14} className="flex-shrink-0 text-zinc-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/8 px-4 py-2 text-[11px] text-zinc-500">
                        <span>↑↓ to navigate · Enter to open · Esc to close</span>
                        <span className="hidden lg:block">⌘K</span>
                    </div>
                </div>
            )}
        </div>
    );
}
