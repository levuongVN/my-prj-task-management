import clsx from 'clsx'
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type ButtonProps = {
  children: ReactNode
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseStyles = `
rounded-2xl
transition-all
duration-200
font-semibold
flex
items-center
justify-center
gap-3
`

const variants = {
  primary:
    'bg-accent text-accent-fg hover:opacity-90 shadow-lg',

  secondary:
    'border border-white/10 bg-white/5 text-white hover:bg-white/10',

  ghost:
    '',
}
const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5',
  lg: 'h-16 px-6 text-lg',
}

import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',
  className,
  size = 'md',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
        isLoading && "opacity-70 cursor-not-allowed"
      )}
      {...props}
      disabled={isLoading ? true : props.disabled}
    >
      {isLoading ? (
        <>
            <Loader2 className="animate-spin" size={20} />
            {children}
        </>
      ) : (
          children
      )}
    </button>
  )
}