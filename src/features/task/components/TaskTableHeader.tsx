export default function TaskTableHeader() {
    return (
        <div className="hidden md:grid grid-cols-12 px-6 py-5 border-b border-white/5 text-zinc-500 text-sm">
            <div className="col-span-5">Task</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1" />
        </div>
    )
}