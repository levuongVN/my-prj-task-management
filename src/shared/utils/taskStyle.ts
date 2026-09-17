// Badge style pattern thống nhất của app: color/15 bg + color-400 text + color/20 border
// (hoạt động trên cả dark & light theme: alpha bg hiển thị tốt trên 2 nền,
// text color có override riêng trong index.css cho light theme)

export const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'bg-red-500/15 text-red-400 border border-red-500/20'

        case 'Medium':
            return 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20'

        case 'Low':
            return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'

        default:
            return 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
    }
}

export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Pending':
            return 'bg-orange-500/15 text-orange-300 border border-orange-500/20'

        case 'In Progress':
            return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'

        case 'In Review':
            return 'bg-purple-500/15 text-purple-400 border border-purple-500/20'

        case 'Completed':
            return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'

        // Legacy labels — giữ lại cho an toàn nơi còn dùng
        case 'Todo':
            return 'bg-gray-500/15 text-gray-300 border border-gray-500/20'

        case 'Overdue':
            return 'bg-red-500/15 text-red-400 border border-red-500/20'

        default:
            return 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
    }
}
