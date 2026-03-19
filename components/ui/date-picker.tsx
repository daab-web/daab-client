"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<number>(
    value ? new Date(value + "T00:00:00").getMonth() : new Date().getMonth(),
  );
  const [year, setYear] = React.useState<number>(
    value
      ? new Date(value + "T00:00:00").getFullYear()
      : new Date().getFullYear(),
  );
  const [day, setDay] = React.useState<number>(
    value ? new Date(value + "T00:00:00").getDate() : 1,
  );

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  const minDateObj = minDate ? new Date(minDate + "T00:00:00") : null;
  const maxDateObj = maxDate ? new Date(maxDate + "T00:00:00") : null;

  const isDateDisabled = (d: number) => {
    const testDate = new Date(year, month, d);
    if (minDateObj && testDate < minDateObj) return true;
    if (maxDateObj && testDate > maxDateObj) return true;
    return false;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleSelectDay = (d: number | null) => {
    if (d === null || isDateDisabled(d)) return;
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    onChange?.(`${year}-${monthStr}-${dayStr}`);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    setMonth((m) => (m === 0 ? 11 : m - 1));
    if (month === 0) setYear((y) => y - 1);
  };

  const handleNextMonth = () => {
    setMonth((m) => (m === 11 ? 0 : m + 1));
    if (month === 11) setYear((y) => y + 1);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            selectedDate.toLocaleDateString("en-GB", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || year)}
              className="w-24 text-center"
              placeholder="Year"
            />
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                {monthNames[month]} {year}
              </div>
              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(d)}
                  disabled={d === null || isDateDisabled(d)}
                  className={cn(
                    "w-8 h-8 text-sm rounded-md flex items-center justify-center",
                    d === null && "invisible",
                    d !== null &&
                      !isDateDisabled(d) &&
                      "hover:bg-accent cursor-pointer",
                    d !== null &&
                      isDateDisabled(d) &&
                      "text-muted-foreground cursor-not-allowed opacity-50",
                    selectedDate &&
                      d === selectedDate.getDate() &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getFullYear() === year
                      ? "bg-primary text-primary-foreground"
                      : "",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
