"use client";

import { useCallback, useEffect, useState } from "react";
import { HabitForm } from "./HabitForm";
import { HabitItem } from "./HabitItem";
import { HabitHeatmap } from "./HabitHeatmap";
import type { Habit } from "@/types";
import { Flame, ChevronDown } from "lucide-react";

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedHeatmap, setExpandedHeatmap] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(data);
    } catch {
      // silent refresh failure — habits remain visible
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const todayCompleted = habits.filter((h) => {
    const today = new Date().toDateString();
    return h.completions.some((c) => new Date(c.date).toDateString() === today);
  }).length;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {habits.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Habits", value: habits.length },
            { label: "Done Today", value: `${todayCompleted}/${habits.length}` },
            { label: "Combined Streak", value: `${totalStreaks}🔥` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <HabitForm onCreated={fetchHabits} />

      {initialLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Flame className="h-10 w-10 opacity-30" />
          <p className="text-sm">No habits yet. Start building one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id}>
              <HabitItem habit={habit} onUpdate={fetchHabits} />
              <button
                onClick={() => setExpandedHeatmap(expandedHeatmap === habit.id ? null : habit.id)}
                className="mt-1 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedHeatmap === habit.id ? "rotate-180" : ""}`} />
                {expandedHeatmap === habit.id ? "Hide heatmap" : "Show 90-day heatmap"}
              </button>
              {expandedHeatmap === habit.id && (
                <div className="mt-2">
                  <HabitHeatmap habit={habit} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
