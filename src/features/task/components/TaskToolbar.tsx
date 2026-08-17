import {
    Search,
    LayoutGrid,
    List,
} from 'lucide-react';
import FilterDropdown from '../../../shared/components/Ui/FilterDropdown';
import SortDropdown from '../../../shared/components/Ui/SortDropdown';
import { priorities, statuses } from '../../../constants/taskOption';

interface TaskToolbarProps {
    searchTerm: string;
    onSearchChange: (v: string) => void;
    selectedPriorities: string[];
    onPrioritiesChange: (v: string[]) => void;
    selectedStatuses: string[];
    onStatusesChange: (v: string[]) => void;
    onClearFilters: () => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortByChange: (v: string) => void;
    onSortOrderChange: (o: 'asc' | 'desc') => void;
    viewMode: 'list' | 'board';
    onViewModeChange: (v: 'list' | 'board') => void;
}

export function TaskToolbar({
    searchTerm,
    onSearchChange,
    selectedPriorities,
    onPrioritiesChange,
    selectedStatuses,
    onStatusesChange,
    onClearFilters,
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
    viewMode,
    onViewModeChange,
}: TaskToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
                <Search
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-zinc-950 border border-white/5 pl-14 pr-5 outline-none text-white placeholder:text-zinc-500 focus:border-zinc-700 transition"
                />
            </div>

            <FilterDropdown
                title="Filter Tasks"
                groups={[
                    {
                        title: 'Priority',
                        colors: {
                            High: 'bg-red-500',
                            Medium: 'bg-yellow-500',
                            Low: 'bg-green-500',
                        },
                        options: priorities,
                        selected: selectedPriorities,
                        onChange: onPrioritiesChange,
                    },
                    {
                        title: 'Status',
                        colors: {
                            Pending: 'bg-yellow-500',
                            'In Progress': 'bg-blue-500',
                            'In Review': 'bg-purple-500',
                            Completed: 'bg-green-500',
                        },
                        options: statuses,
                        selected: selectedStatuses,
                        onChange: onStatusesChange,
                    },
                ]}
                onClear={onClearFilters}
                className="
                flex items-center gap-1.5 rounded-xl border border-white/10 cursor-pointer hover:bg-zinc-900 transition px-3 h-14
                "
            />
            <SortDropdown
                title="Sort Tasks"
                sortBy={sortBy}
                sortOrder={sortOrder}
                options={[
                    { label: 'Priority', value: 'priority' },
                    { label: 'Status', value: 'status' },
                    { label: 'Due Date', value: 'due' },
                    { label: 'Title', value: 'title' },
                ]}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 cursor-pointer hover:bg-zinc-900 transition px-3 h-14"
                onSortByChange={onSortByChange}
                onSortOrderChange={onSortOrderChange}
            />
            
            <div className="flex border border-border-subtle bg-zinc-900 rounded-xl p-1 h-14 items-center shrink-0">
                <button 
                    onClick={() => onViewModeChange('list')}
                    className={`h-full px-4 rounded-lg flex items-center justify-center transition ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <List size={20} />
                </button>
                <button 
                    onClick={() => onViewModeChange('board')}
                    className={`h-full px-4 rounded-lg flex items-center justify-center transition ${viewMode === 'board' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                    <LayoutGrid size={20} />
                </button>
            </div>
        </div>
    );
}
