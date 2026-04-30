"use client";

import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types";

interface Props { habit: Habit }

export function HabitHeatmap({ habit }: Props) {
  const completionSet = new Set(
    habit.completions.map((c) => startOfDay(new Date(c.date)).getTime())
  );

  const today = startOfDay(new Date());
  const start = subDays(today, 89); // 90 days
  const days = eachDayOfInterval({ start, end: today });

  // Group into weeks (columns)
  const weeks: Date[][] = [];
  let week: Date[] = [];
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length) weeks.push(week);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{habit.name} — 90-day heatmap</span>
        <span className="text-xs text-muted-foreground">
          {habit.completions.length} completions
        </span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((wk, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {wk.map((day) => {
              const done = completionSet.has(day.getTime());
              return (
                <div
                  key={day.getTime()}
                  title={`${format(day, "MMM d")} ${done ? "✓" : ""}`}
                  className={cn("h-3.5 w-3.5 rounded-sm transition", done ? "opacity-100" : "bg-muted opacity-40")}
                  style={done ? { backgroundColor: habit.color } : {}}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0.2, 0.4, 0.7, 1].map((op) => (
          <div key={op} className="h-3 w-3 rounded-sm" style={{ backgroundColor: habit.color, opacity: op }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
