import clsx from 'clsx'
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type ButtonProps = {
  children: ReactNode
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
    'bg-black text-white hover:bg-zinc-800 shadow-lg',

  secondary:
    'border border-zinc-200 bg-white text-black hover:bg-zinc-50',

  ghost:
    '',
}
const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5',
  lg: 'h-16 px-6 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  className,
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}