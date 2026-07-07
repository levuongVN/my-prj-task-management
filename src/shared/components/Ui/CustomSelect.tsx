'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'

import {
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'

type Option = {
  label: string
  value: string
}

type Props = {
  value: string
  options: Option[]
  onChange: (value: string) => void
  type?: 'priority' | 'status'
}

export default function CustomSelect({
  value,
  options,
  onChange,
  type = 'priority',
}: Props) {
  const getStyle = (val: string) => {
    const v = val?.toLowerCase() || '';
    if (type === 'priority') {
      switch (v) {
        case 'high':
          return 'bg-red-500/10 text-red-400 border-red-500/20'
        case 'medium':
          return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
        case 'low':
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        default:
          return 'bg-zinc-900 text-zinc-300 border-white/10'
      }
    }

    switch (v) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'in progress':
      case 'active':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'pending':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/20'
      case 'in review':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'archived':
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      default:
        return 'bg-zinc-900 text-zinc-300 border-white/10'
    }
  }

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton
          className={`
            relative w-full rounded-2xl border
            py-3 pl-4 pr-10 text-left
            text-sm font-semibold
            backdrop-blur-xl
            transition-all duration-200
            hover:border-white/20
            ${getStyle(value)}
          `}
        >
          <span className="block truncate">
            {options.find((opt) => opt.value === value)?.label || value}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronUpDownIcon className="h-5 w-5 text-white/50" />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="
            absolute z-50 mt-2 max-h-60 w-full overflow-auto
            rounded-2xl border border-white/10
            bg-zinc-950 p-2 shadow-2xl
            backdrop-blur-2xl
            transition duration-200 ease-out
            data-[closed]:scale-95
            data-[closed]:opacity-0
          "
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus }) =>
                `
                relative cursor-pointer select-none
                rounded-xl px-4 py-3 text-sm
                transition-all duration-150
                ${
                  focus
                    ? 'bg-white text-black'
                    : 'text-white'
                }
              `
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`
                      block truncate
                      ${selected ? 'font-semibold' : 'font-normal'}
                    `}
                  >
                    {option.label}
                  </span>

                  {selected && (
                    <span className="absolute inset-y-0 right-3 flex items-center">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}