"use client";

import { useEffect, useState } from "react";
import { StreakChart } from "@/components/analytics/StreakChart";
import { CompletionChart } from "@/components/analytics/CompletionChart";
import type { Habit } from "@/types";
import { Trophy, Flame, Target, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/habits")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setHabits)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const currentBest = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  const avgStreak = habits.length ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0;

  const statCards = [
    { label: "Best Ever Streak", value: `${bestStreak}d`, icon: Trophy, color: "text-amber-400" },
    { label: "Current Best", value: `${currentBest}d`, icon: Flame, color: "text-orange-400" },
    { label: "Total Completions", value: totalCompletions, icon: Target, color: "text-green-400" },
    { label: "Avg Active Streak", value: `${avgStreak}d`, icon: TrendingUp, color: "text-indigo-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your progress and habit performance over time.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <CompletionChart habits={habits} />
          <StreakChart habits={habits} />

          {/* Per-habit breakdown */}
          {habits.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Per-habit Breakdown</h3>
              <div className="space-y-3">
                {habits.map((h) => {
                  const recentCompletions = h.completions.filter((c) => {
                    const d = new Date(c.date);
                    const now = new Date();
                    return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 30;
                  }).length;
                  const daysSinceCreation = Math.ceil((new Date().getTime() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  const denominator = Math.max(1, Math.min(30, daysSinceCreation));
                  const rate = Math.min(100, Math.round((recentCompletions / denominator) * 100));

                  return (
                    <div key={h.id} className="flex items-center gap-3">
                      <span className="text-lg shrink-0">{h.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate">{h.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">{rate}% (30d)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: h.color }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs shrink-0" style={{ color: h.color }}>
                        <Flame className="h-3.5 w-3.5" />
                        <span className="font-bold">{h.streak}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
