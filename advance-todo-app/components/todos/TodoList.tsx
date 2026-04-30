"use client";

import { useCallback, useEffect, useState } from "react";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { TodoFilters } from "./TodoFilters";
import type { Todo } from "@/types";
import { CheckSquare } from "lucide-react";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filter, setFilter] = useState({ priority: "ALL", completed: "ALL" });

  const fetchTodos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter.priority !== "ALL") params.set("priority", filter.priority);
      if (filter.completed === "ACTIVE") params.set("completed", "false");
      if (filter.completed === "DONE") params.set("completed", "true");
      const res = await fetch(`/api/todos?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setTodos(data);
    } catch {
      // silent — keep existing list visible
    } finally {
      setInitialLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setInitialLoading(true);
    fetchTodos();
  }, [fetchTodos]);

  const active = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      <TodoFilters filter={filter} onChange={setFilter} />
      <TodoForm onCreated={fetchTodos} />

      {initialLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <CheckSquare className="h-10 w-10 opacity-30" />
          <p className="text-sm">No todos found. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((todo) => <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />)}
          {done.length > 0 && (
            <>
              <p className="pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Completed</p>
              {done.map((todo) => <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
