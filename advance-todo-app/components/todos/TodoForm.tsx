"use client";

import { useState } from "react";
import { Plus, X, Calendar, Tag, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-slate-400",
  MEDIUM: "text-blue-400",
  HIGH: "text-amber-400",
  URGENT: "text-red-400",
};

interface Props {
  onCreated: () => void;
}

export function TodoForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [syncCalendar, setSyncCalendar] = useState(false);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function addSubtask() {
    const s = subtaskInput.trim();
    if (s) setSubtasks([...subtasks, s]);
    setSubtaskInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, dueDate: dueDate || null, tags, subtasks, syncToCalendar: syncCalendar }),
      });
      if (!res.ok) throw new Error();
      toast.success("Todo created!");
      setTitle(""); setDescription(""); setPriority("MEDIUM"); setDueDate("");
      setTags([]); setSubtasks([]); setSyncCalendar(false); setOpen(false);
      onCreated();
    } catch {
      toast.error("Failed to create todo");
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
        <Plus className="h-4 w-4" /> Add a new todo…
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 shadow-lg space-y-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title…"
        className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full resize-none bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {/* Priority */}
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={cn("appearance-none rounded-lg border border-border bg-muted px-3 py-1.5 pr-7 text-xs font-medium focus:outline-none cursor-pointer", PRIORITY_COLORS[priority])}
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        </div>

        {/* Due date */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-transparent text-xs text-foreground focus:outline-none"
          />
        </div>

        {/* Sync Calendar */}
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={syncCalendar} onChange={(e) => setSyncCalendar(e.target.checked)} className="h-3 w-3 rounded" />
          Sync Calendar
        </label>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-indigo-600/15 px-2 py-0.5 text-xs text-indigo-400">
            {tag}
            <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}><X className="h-2.5 w-2.5" /></button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder="Add tag…"
          className="w-20 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Subtasks */}
      <div className="space-y-1">
        {subtasks.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-border" />
            {s}
            <button type="button" onClick={() => setSubtasks(subtasks.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
          </div>
        ))}
        <input
          value={subtaskInput}
          onChange={(e) => setSubtaskInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
          placeholder="+ Add subtask…"
          className="w-full bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent">Cancel</button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}
