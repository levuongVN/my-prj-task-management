type Props = {
    children: React.ReactNode
    span?: string
    className?: string
}

export default function TaskCell({
    children,
    span = 'col-span-2',
    className = '',
}: Props) {
    return (
        <div className={`${span} flex items-center ${className}`}>
            {children}
        </div>
    )
}