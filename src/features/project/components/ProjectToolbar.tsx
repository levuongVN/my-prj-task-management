import { Search } from 'lucide-react';
import FilterDropdown from '../../../shared/components/Ui/FilterDropdown';
import SortDropdown from '../../../shared/components/Ui/SortDropdown';
import { STATUS_OPTIONS, SORT_OPTIONS } from '../../../constants/projectConst';

interface ProjectToolbarProps {
    search: string;
    onSearchChange: (v: string) => void;
    selectedStatuses: number[];
    onStatusesChange: (indexes: number[]) => void;
    onClearFilters: () => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortByChange: (v: string) => void;
    onSortOrderChange: (o: 'asc' | 'desc') => void;
}

export function ProjectToolbar({
    search,
    onSearchChange,
    selectedStatuses,
    onStatusesChange,
    onClearFilters,
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
}: ProjectToolbarProps) {
    return (
        <div className="mb-7 flex gap-2">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-white/8 bg-[#1a1a1a] px-3">
                <Search size={14} className="text-zinc-600" />
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
                />
            </div>
            <FilterDropdown
                title="Filter Projects"
                groups={[
                    {
                        title: 'Status',
                        options: [...STATUS_OPTIONS],
                        selected: selectedStatuses.map((n) =>
                            STATUS_OPTIONS[n] ?? STATUS_OPTIONS[0]
                        ),
                        onChange: (values) =>
                            onStatusesChange(
                                (values as string[]).map(
                                    (v) => STATUS_OPTIONS.indexOf(v as typeof STATUS_OPTIONS[number])
                                ).filter((n) => n !== -1)
                            ),
                        colors: {
                            active: 'bg-blue-500',
                            completed: 'bg-emerald-500',
                            archived: 'bg-zinc-500',
                        },
                    },
                ]}
                onClear={onClearFilters}
            />
            <SortDropdown
                title="Sort Projects"
                sortBy={sortBy}
                sortOrder={sortOrder}
                options={
                    SORT_OPTIONS.map((option) => ({
                        label: option.label,
                        value: option.value,
                    }))
                }
                onSortByChange={
                    (value) =>
                        onSortByChange(
                            value as typeof SORT_OPTIONS[number]['value']
                        )
                }
                onSortOrderChange={onSortOrderChange}
            />
        </div>
    );
}
