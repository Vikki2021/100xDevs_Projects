"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const ICONS = ["🎯", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "✍️", "🎨", "🎵", "🧹"];
const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props { onCreated: () => void }

export function HabitForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState("#6366f1");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY" | "CUSTOM">("DAILY");
  const [targetDays, setTargetDays] = useState<number[]>([]);

  function toggleDay(d: number) {
    setTargetDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, icon, color, frequency, targetDays }),
      });
      if (!res.ok) throw new Error();
      toast.success("Habit created!");
      setName(""); setDescription(""); setIcon("🎯"); setColor("#6366f1");
      setFrequency("DAILY"); setTargetDays([]); setOpen(false);
      onCreated();
    } catch {
      toast.error("Failed to create habit");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Add a new habit…
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 shadow-lg space-y-4">
      <h3 className="text-sm font-semibold text-foreground">New Habit</h3>

      <div className="space-y-2">
        <input
          autoFocus value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Habit name…"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
        />
        <input
          value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Icon picker */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Icon</p>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((ic) => (
            <button key={ic} type="button" onClick={() => setIcon(ic)}
              className={`h-9 w-9 rounded-xl text-lg transition ${icon === ic ? "ring-2 ring-indigo-600 bg-indigo-600/10" : "hover:bg-accent"}`}
            >{ic}</button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Color</p>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-7 w-7 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-card ring-white/60 scale-110" : "opacity-70 hover:opacity-100"}`}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Frequency</p>
        <div className="flex gap-2">
          {(["DAILY", "WEEKLY", "CUSTOM"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFrequency(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${frequency === f ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >{f[0] + f.slice(1).toLowerCase()}</button>
          ))}
        </div>
        {frequency === "CUSTOM" && (
          <div className="mt-3 flex gap-1.5">
            {DAYS.map((day, i) => (
              <button key={i} type="button" onClick={() => toggleDay(i)}
                className={`h-9 w-9 rounded-full text-xs font-medium transition ${targetDays.includes(i) ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
              >{day[0]}</button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent">Cancel</button>
        <button type="submit" disabled={loading || !name.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >{loading ? "Creating…" : "Create Habit"}</button>
      </div>
    </form>
  );
}
