export const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'bg-red-500/15 text-red-400 border border-red-500/20'

        case 'Medium':
            return 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20'

        case 'Low':
            return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'

        default:
            return 'bg-zinc-800 text-zinc-300 border border-zinc-700'
    }
}
export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'

        case 'Todo':
            return 'bg-gray-500/15 text-gray-300 border border-gray-500/20'

        case 'Overdue':
            return 'bg-red-500/15 text-red-400 border border-red-500/20'

        default:
            return 'bg-zinc-800 text-zinc-300 border border-zinc-700'
    }
}