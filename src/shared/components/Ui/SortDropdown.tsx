import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import {
    ChevronDown,
    SlidersHorizontal,
} from "lucide-react";

interface SortOption<T extends string> {
    label: string;
    value: T;
}

interface Props<T extends string> {
    title?: string;

    sortBy: T;
    options: SortOption<T>[];

    sortOrder: "asc" | "desc";

    onSortByChange: (value: T) => void;
    onSortOrderChange: (
        value: "asc" | "desc"
    ) => void;

    className?: string;
}

export default function SortDropdown<
    T extends string
>({
    title = "Sort",

    sortBy,
    sortOrder,

    options,

    onSortByChange,
    onSortOrderChange,

    className,
}: Props<T>) {
    const currentLabel =
        options.find(
            (o) => o.value === sortBy
        )?.label ?? title;

    return (
        <Menu
            as="div"
            className={`relative `}
        >
            <MenuButton
                className={className ?? `flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors`}
            >
                <SlidersHorizontal size={18} />

                {currentLabel}

                <ChevronDown size={16} />
            </MenuButton>

            <MenuItems
                className={`
                    absolute right-0 z-50 mt-3

                    w-[320px]
                    rounded-3xl
                    border border-white/10

                    bg-zinc-950

                    p-5
                    shadow-2xl
                `}
            >
                <h3 className="mb-5 text-lg font-semibold">
                    {title}
                </h3>

                {/* Sort By */}
                <div>
                    <p className="mb-3 text-sm text-zinc-400">
                        Sort By
                    </p>

                    <div className="space-y-2">
                        {options.map((item) => (
                            <button
                                key={item.value}
                                onClick={() =>
                                    onSortByChange(
                                        item.value
                                    )
                                }
                                className={`
                                    flex w-full items-center justify-between

                                    rounded-xl border
                                    px-4 py-3

                                    transition-colors

                                    ${sortBy === item.value
                                        ? "border-white bg-white text-black"
                                        : "border-white/10 hover:border-white/20"
                                    }
                                `}
                            >
                                {item.label}

                                {sortBy ===
                                    item.value &&
                                    "✓"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="my-5 border-b border-white/5" />

                {/* Direction */}
                <div>
                    <p className="mb-3 text-sm text-zinc-400">
                        Direction
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {(
                            [
                                {
                                    value: "asc",
                                    label: "Ascending",
                                },
                                {
                                    value: "desc",
                                    label: "Descending",
                                },
                            ] as const
                        ).map((item) => (
                            <button
                                key={item.value}
                                onClick={() =>
                                    onSortOrderChange(
                                        item.value
                                    )
                                }
                                className={`
                                    rounded-xl py-3

                                    ${sortOrder ===
                                        item.value
                                        ? "bg-white text-black"
                                        : "border border-white/10 bg-black"
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </MenuItems>
        </Menu>
    );
}