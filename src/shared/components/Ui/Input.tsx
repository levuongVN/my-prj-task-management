import clsx from 'clsx'
import type {
    InputHTMLAttributes,
    ReactNode,
} from 'react'

type InputProps = {
    icon?: ReactNode
    error?: string
    leftIcon?: ReactNode
    rightIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({
    leftIcon,
    rightIcon,
    error,
    className,
    ...props
}: InputProps) {
    return (
        <div>
            <div
                className={clsx(`flex items-center h-16 rounded-2xl border bg-zinc-50 px-5 transition-all duration-200`,
                    error
                        ? 'border-red-400'
                        : 'border-zinc-200 focus-within:border-black'
                )}
            >
                {leftIcon}

                <input
                    className={clsx(`flex-1 h-full bg-transparent outline-none px-4 text-lg text-black placeholder:text-zinc-400`,
                        className
                    )}
                    {...props}
                />
                {rightIcon}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}
        </div>
    )
}