"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { subDays, format, startOfDay } from "date-fns";
import type { Habit } from "@/types";

interface Props { habits: Habit[] }

export function CompletionChart({ habits }: Props) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 13 - i));
    const label = format(date, "MMM d");
    const completed = habits.filter((h) =>
      h.completions.some((c) => startOfDay(new Date(c.date)).getTime() === date.getTime())
    ).length;
    return { label, completed, total: habits.length };
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Daily Habit Completion (14 days)</h3>
      {habits.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-8">No habits to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={days} margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" interval={1} />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.75rem", fontSize: 12 }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Completed" />
            <Line type="monotone" dataKey="total" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Total habits" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
