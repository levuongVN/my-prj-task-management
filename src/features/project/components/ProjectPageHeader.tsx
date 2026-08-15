import { Plus } from 'lucide-react';
import Button from '../../../shared/components/Ui/Button';

interface ProjectPageHeaderProps {
    onCreate: () => void;
}

export function ProjectPageHeader({ onCreate }: ProjectPageHeaderProps) {
    return (
        <div className="mb-6 flex items-end justify-between">
            <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                    Project management
                </p>
                <h1 className="text-[22px] font-medium text-white">Your Projects</h1>
                <p className="mt-1 text-sm text-zinc-600">Track progress across all your initiatives.</p>
            </div>
            <Button
                onClick={onCreate}
                variant="ghost"
                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
            >
                <Plus size={14} />
                New project
            </Button>
        </div>
    );
}
