"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  minDate?: Date
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  error = false,
  disabled = false,
  minDate
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal border-4 rounded-2xl px-4 py-3 text-lg bg-white focus:outline-none transition-all appearance-none cursor-pointer h-auto min-h-[60px] pr-5",
            !date && "text-gray-400",
            error 
              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" 
              : "border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-4 border-gray-200 rounded-2xl shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={(date: Date) => minDate ? date < minDate : false}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 