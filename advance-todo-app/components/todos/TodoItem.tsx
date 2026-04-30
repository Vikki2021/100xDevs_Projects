"use client";

import { useState } from "react";
import { Trash2, Calendar, ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import { format } from "date-fns";
import { cn, getPriorityColor, getPriorityDot } from "@/lib/utils";
import type { Todo } from "@/types";
import toast from "react-hot-toast";

interface Props {
  todo: Todo;
  onUpdate: () => void;
}

export function TodoItem({ todo, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleComplete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to update");
        return;
      }
      onUpdate();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  async function toggleSubtask(subtaskId: string, completed: boolean) {
    try {
      const res = await fetch(`/api/todos/${todo.id}/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
        toast.error("Failed to update subtask");
        return;
      }
      onUpdate();
    } catch {
      toast.error("Network error — please try again");
    }
  }

  async function deleteTodo() {
    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to delete");
        return;
      }
      toast.success("Deleted");
      onUpdate();
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className={cn(
      "group rounded-xl border bg-card p-4 transition-all",
      todo.completed ? "border-border opacity-60" : "border-border hover:border-indigo-600/40 hover:shadow-md hover:shadow-indigo-600/5"
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={toggleComplete}
          disabled={loading}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-indigo-400 transition disabled:opacity-50"
        >
          {loading
            ? <div className="h-5 w-5 rounded border-2 border-current border-t-transparent animate-spin" />
            : todo.completed
              ? <CheckSquare className="h-5 w-5 text-indigo-400" />
              : <Square className="h-5 w-5" />
          }
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-sm font-medium", todo.completed && "line-through text-muted-foreground")}>
              {todo.title}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getPriorityColor(todo.priority))}>
              <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", getPriorityDot(todo.priority))} />
              {todo.priority}
            </span>
            {todo.calendarEventId && (
              <span title="Synced to Google Calendar">
                <Calendar className="h-3.5 w-3.5 text-green-400" />
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {todo.dueDate && (
              <span className={cn(isOverdue && "text-red-400 font-medium")}>
                {isOverdue ? "Overdue · " : ""}{format(new Date(todo.dueDate), "MMM d, h:mm a")}
              </span>
            )}
            {todo.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-indigo-600/10 px-2 py-0.5 text-indigo-400">#{tag}</span>
            ))}
            {todo.subtasks.length > 0 && (
              <span>{completedSubtasks}/{todo.subtasks.length} subtasks</span>
            )}
          </div>

          {/* Description (collapsed) */}
          {todo.description && !expanded && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{todo.description}</p>
          )}

          {/* Expanded: description + subtasks */}
          {expanded && (
            <div className="mt-3 space-y-1.5">
              {todo.description && (
                <p className="text-xs text-muted-foreground mb-2">{todo.description}</p>
              )}
              {todo.subtasks.map((sub) => (
                <label key={sub.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={(e) => toggleSubtask(sub.id, e.target.checked)}
                    className="h-3.5 w-3.5 rounded accent-indigo-600"
                  />
                  <span className={cn("text-xs", sub.completed && "line-through text-muted-foreground")}>
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          {(todo.subtasks.length > 0 || todo.description) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={deleteTodo}
            disabled={loading}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Subtask progress bar */}
      {todo.subtasks.length > 0 && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${(completedSubtasks / todo.subtasks.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
