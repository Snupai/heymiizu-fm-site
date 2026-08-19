"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  minDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  error = false,
  disabled = false,
  minDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-auto min-h-[60px] w-full cursor-pointer appearance-none justify-between rounded-2xl border-4 bg-white px-3 py-2 pr-5 text-left text-base font-normal transition-all focus:outline-none sm:px-4 sm:py-3 sm:text-lg",
            !date && "text-gray-400",
            error
              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              : "border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={disabled}
        >
          {date ? format(date, "dd.MM.yyyy") : <span>{placeholder}</span>}
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-2xl border-4 border-gray-200 bg-white p-0 shadow-lg"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={(date: Date) => (minDate ? date < minDate : false)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
