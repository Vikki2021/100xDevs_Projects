"use client";

const PRIORITIES = ["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"] as const;

interface Props {
  filter: { priority: string; completed: string };
  onChange: (f: { priority: string; completed: string }) => void;
}

export function TodoFilters({ filter, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status */}
      <div className="flex rounded-xl border border-border bg-muted p-1 text-xs">
        {(["ALL", "ACTIVE", "DONE"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onChange({ ...filter, completed: s })}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              filter.completed === s
                ? "bg-card text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : s === "ACTIVE" ? "Active" : "Done"}
          </button>
        ))}
      </div>

      {/* Priority */}
      <div className="flex flex-wrap gap-1">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => onChange({ ...filter, priority: p })}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              filter.priority === p
                ? "bg-indigo-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {p === "ALL" ? "Any priority" : p}
          </button>
        ))}
      </div>
    </div>
  );
}
