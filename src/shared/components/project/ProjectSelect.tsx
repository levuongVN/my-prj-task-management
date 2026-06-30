import { Fragment, useMemo, useState } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";

export type ProjectOption = {
    id: string;
    name: string;
};

interface Props {
    value?: string;
    projects: ProjectOption[];
    placeholder?: string;
    onChange: (id: string) => void;
}

export default function ProjectSelect({
    value,
    projects,
    placeholder = "Select project...",
    onChange,
}: Props) {
    const [query, setQuery] = useState("");

    const selectedProject = projects.find(
        (p) => p.id === value
    );

    const filteredProjects = useMemo(() => {
        if (!query.trim()) return projects;

        return projects.filter((p) =>
            p.name
                .toLowerCase()
                .includes(query.toLowerCase())
        );
    }, [projects, query]);

    return (
        <Combobox
            value={selectedProject ?? null}
            onChange={(project: ProjectOption | null) =>
                onChange(project?.id ?? "")
            }
        >
            {({ open }) => (
                <div className="relative">

                    {/* Input — wrapping in ComboboxButton makes clicking the input itself open the list */}

                    <div className="relative">
                        <ComboboxButton as={Fragment}>
                            <ComboboxInput
                                displayValue={(project: ProjectOption) =>
                                    project?.name ?? ""
                                }
                                onChange={(e) =>
                                    setQuery(e.target.value)
                                }
                                onClick={(e) => {
                                    // Nếu list đang mở thì chặn default (không cho ComboboxButton đóng lại)
                                    if (open) e.preventDefault();
                                }}
                                placeholder={placeholder}
                                className="
                                    h-12
                                    w-full
                                    rounded-2xl
                                    border border-white/10
                                    bg-black
                                    px-4
                                    pr-10
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-500
                                    focus:border-white/30
                                "
                            />
                        </ComboboxButton>

                        <ComboboxButton
                            className="absolute inset-y-0 right-3 flex items-center"
                        >
                            <ChevronUpDownIcon className="h-5 w-5 text-zinc-500" />
                        </ComboboxButton>
                    </div>

                    <Transition
                        as={Fragment}
                        leave="transition duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <ComboboxOptions
                            anchor="bottom"
                            className="
                                z-50
                                mt-2
                                max-h-72
                                w-[var(--input-width)]
                                overflow-auto
                                rounded-2xl
                                border border-white/10
                                bg-zinc-950
                                p-2
                                shadow-2xl
                                empty:invisible
                            "
                        >
                            {/* No Project */}

                            <ComboboxOption
                                value={null}
                                className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-white data-[focus]:bg-white data-[focus]:text-black"
                            >
                                No Project
                            </ComboboxOption>

                            {filteredProjects.map((project) => (
                                <ComboboxOption
                                    key={project.id}
                                    value={project}
                                    className="
                                        group
                                        flex
                                        cursor-pointer
                                        items-center
                                        justify-between
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-white
                                        data-[focus]:bg-white
                                        data-[focus]:text-black
                                    "
                                >
                                    {({ selected }) => (
                                        <>
                                            <span>
                                                {project.name}
                                            </span>

                                            {selected && (
                                                <CheckIcon className="h-4 w-4" />
                                            )}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))}

                            {filteredProjects.length === 0 && (
                                <div className="px-3 py-3 text-sm text-zinc-500">
                                    No projects found.
                                </div>
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            )}
        </Combobox>
    );
}