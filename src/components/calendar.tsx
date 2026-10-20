import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay, isSameMonth, isSunday, parseISO, startOfDay, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MonthCalendar({ value, onChange }: { value: string | null; onChange: (iso: string) => void }) {
  const selected = value ? parseISO(value) : null;
  const [cursor, setCursor] = useState(selected ?? new Date());
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor)),
    end: endOfWeek(endOfMonth(cursor)),
  });
  const today = startOfDay(new Date());

  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="flex size-11 items-center justify-center" aria-label="Previous month" onClick={() => setCursor((date) => subMonths(date, 1))}>
          <ChevronLeft strokeWidth={1.75} />
        </button>
        <p className="font-display text-lg uppercase">{format(cursor, "MMMM yyyy")}</p>
        <button type="button" className="flex size-11 items-center justify-center" aria-label="Next month" onClick={() => setCursor((date) => addMonths(date, 1))}>
          <ChevronRight strokeWidth={1.75} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-wide text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`} className="py-1">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const disabled = isBefore(day, today) || isSunday(day) || !isSameMonth(day, cursor);
          const active = selected ? isSameDay(day, selected) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(format(day, "yyyy-MM-dd"))}
              className={cn(
                "mx-auto flex size-11 items-center justify-center rounded-full text-sm",
                active && "bg-accent font-bold text-ink",
                !active && isSameDay(day, today) && "ring-1 ring-sky",
                disabled && "text-white/25",
                !disabled && !active && "text-white",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-muted">Past dates and Sundays are unavailable.</p>
    </div>
  );
}
