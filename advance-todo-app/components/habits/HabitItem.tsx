"use client";

import { useState } from "react";
import { Flame, Trash2, Check } from "lucide-react";
import { startOfDay, subDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types";
import toast from "react-hot-toast";

interface Props {
  habit: Habit;
  onUpdate: () => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function HabitItem({ habit, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  // Build last 7 days completion map
  const completionSet = new Set(
    habit.completions.map((c) => startOfDay(new Date(c.date)).getTime())
  );
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = startOfDay(subDays(new Date(), 6 - i));
    return { date: d, done: completionSet.has(d.getTime()) };
  });

  const todayDone = completionSet.has(startOfDay(new Date()).getTime());

  async function toggleToday() {
    setLoading(true);
    try {
      const res = await fetch(`/api/habits/${habit.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      if (data.toggled === "on") {
        toast.success(`🔥 Streak: ${data.streak} day${data.streak !== 1 ? "s" : ""}!`);
      } else {
        toast.success("Unmarked for today");
      }

      onUpdate();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  async function deleteHabit() {
    if (!confirm("Delete this habit and all its history?")) return;
    try {
      await fetch(`/api/habits/${habit.id}`, { method: "DELETE" });
      toast.success("Habit deleted");
      onUpdate();
    } catch {
      toast.error("Failed to delete habit");
    }
  }

  return (
    <div
      className="group rounded-xl border border-border bg-card p-4 transition hover:shadow-md"
      style={{ borderLeftColor: habit.color, borderLeftWidth: 3 }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: habit.color + "20" }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{habit.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{habit.frequency.toLowerCase()}</span>
          </div>
          {habit.description && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">{habit.description}</p>
          )}

          {/* Streak */}
          <div className="mt-2 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1" style={{ color: habit.color }}>
              <Flame className="h-3.5 w-3.5" />
              <span className="font-bold">{habit.streak}</span>
              <span className="text-muted-foreground font-normal">day streak</span>
            </div>
            <span className="text-muted-foreground">Best: {habit.longestStreak}</span>
          </div>

          {/* Last 7 days mini-calendar */}
          <div className="mt-3 flex items-center gap-1">
            {last7.map(({ date, done }, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-muted-foreground">{WEEKDAYS[date.getDay()]}</span>
                <div
                  className={cn("h-5 w-5 rounded-md transition", !done && "opacity-20 bg-muted")}
                  style={done ? { backgroundColor: habit.color } : {}}
                  title={format(date, "MMM d")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={deleteHabit}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Tick button */}
          <button
            onClick={toggleToday}
            disabled={loading}
            style={todayDone ? { backgroundColor: habit.color, borderColor: habit.color } : {}}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all",
              todayDone
                ? "text-white scale-105"
                : "border-border text-muted-foreground hover:scale-105",
              loading && "opacity-50 cursor-not-allowed"
            )}
            title={todayDone ? "Click to unmark" : "Mark as done today"}
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Check className="h-4 w-4" strokeWidth={todayDone ? 3 : 2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
