"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface Option {
  value: string
  label: string
}

interface ComboboxProps {
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  _required?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  error = false,
  disabled = false,
  _required = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal border-4 rounded-2xl px-4 py-3 text-lg bg-white focus:outline-none transition-all appearance-none cursor-pointer h-auto min-h-[60px] pr-5",
            !selectedOption && "text-gray-400",
            error 
              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" 
              : "border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white border-4 border-gray-200 rounded-2xl shadow-lg" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gray-50",
                    value === option.value && "bg-blue-50 text-blue-600"
                  )}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 