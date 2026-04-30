"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { Habit } from "@/types";

interface Props { habits: Habit[] }

export function StreakChart({ habits }: Props) {
  const data = habits.map((h) => ({ name: h.name, streak: h.streak, color: h.color }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Current Streaks</h3>
      {data.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-8">No habits to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.75rem", fontSize: 12 }}
              labelStyle={{ color: "var(--foreground)" }}
              formatter={(v) => [`${v} days`, "Streak"]}
            />
            <Bar dataKey="streak" radius={[0, 6, 6, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
