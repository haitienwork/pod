import { X } from 'lucide-react'
import * as React from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { cn } from '@/lib/utils'
import { Badge } from './badge'
import { Command, CommandGroup, CommandItem, CommandList } from './command'

type Option = Record<'value' | 'label', string>

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onValueChange: (valueSelected: string[]) => void
  className?: string
  placeholder?: string
  optionShow?: 'value' | 'label'
  tagClassName?: string
}

export function MultiSelect({
  options,
  selected,
  onValueChange,
  className,
  placeholder = 'Select options...',
  optionShow = 'label',
  tagClassName,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback(
    (option: string) => {
      onValueChange(selected.filter((s) => s !== option))
    },
    [onValueChange],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            const newSelected = [...selected]
            newSelected.pop()
            onValueChange(newSelected)
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [selected],
  )

  const selectables = options.filter(
    (option) => !selected.includes(option.value),
  )
  const selectedOptions = React.useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [selected],
  )

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        className={cn(
          'group rounded-md border border-input px-3 py-2 text-sm bg-white',
          className,
        )}
      >
        <div className="flex flex-wrap gap-1 max-h-[100px] overflow-auto">
          {selectedOptions.map((option) => {
            return (
              <Badge
                key={option.value}
                variant="secondary"
                className={cn(
                  'rounded-sm bg-neutral-100 h-8 !typo-s14-w400',
                  tagClassName,
                )}
              >
                {optionShow === 'label' ? option.label : option.value}
                <button
                  className="ml-1 rounded-2 outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option.value)}
                  type="button"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full max-h-[400px] overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        setInputValue('')
                        onValueChange([...selected, option.value])
                      }}
                      className={'cursor-pointer'}
                    >
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  )
}
