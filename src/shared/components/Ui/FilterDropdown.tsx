import {
    Menu,
    MenuButton,
    MenuItems,
} from "@headlessui/react";

import {
    Filter,
    ChevronDown,
    X,
} from "lucide-react";

import Button from "./Button";

interface FilterGroup {
    title: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;

    colors?: Record<string, string>;
}

interface Props {
    title?: string;
    groups: FilterGroup[];
    onClear: () => void;

    className?: string;
    menuButtonClassName?: string;
    menuItemsClassName?: string;
}

export default function FilterDropdown({
    title = "Filters",
    groups,
    className,
    onClear,
}: Props) {
    const selectedCount = groups.reduce(
        (acc, group) => acc + group.selected.length,
        0
    );

    return (
        <Menu
            as="div"
            className="relative"
        >
            <MenuButton
                className={className ?? `
                    flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors
                    `}
            >
                <Filter size={18} />

                Filter

                {selectedCount > 0 && (
                    <span
                        className="
                            flex h-5 w-5
                            items-center justify-center
                            rounded-full
                            bg-white
                            text-[10px]
                            font-medium
                            text-black
                        "
                    >
                        {selectedCount}
                    </span>
                )}

                <ChevronDown size={16} />
            </MenuButton>

            <MenuItems
                className="
                    absolute right-0 z-50 mt-3
                    w-[340px]
                    rounded-3xl
                    border border-white/10
                    bg-zinc-950
                    shadow-2xl
                "
            >
                <div className="border-b border-white/5 p-5">
                    <h3 className="text-lg font-semibold">
                        {title}
                    </h3>
                </div>

                <div className="max-h-[350px] overflow-y-auto p-5">
                    {groups.map((group) => (
                        <div key={group.title}>
                            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                {group.title}
                            </p>

                            {group.options.map((option) => {
                                const checked = group.selected.includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            if (checked) {
                                                group.onChange(
                                                    group.selected.filter(
                                                        (v) => v !== option
                                                    )
                                                );
                                            } else {
                                                group.onChange([
                                                    ...group.selected,
                                                    option,
                                                ]);
                                            }
                                        }}
                                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${checked ? "bg-white/5 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                                        <span className={`h-2 w-2 rounded-full ${group.colors?.[option] ?? "bg-zinc-500"}`}
                                        />
                                        {option}
                                        {checked && <X size={12} className="ml-auto text-zinc-500" />}

                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 p-5">
                    <Button
                        variant="ghost"
                        onClick={onClear}
                    >
                        Clear
                    </Button>
                </div>
            </MenuItems>
        </Menu>
    );
}