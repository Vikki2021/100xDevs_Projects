"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-300",
        "bg-slate-200 dark:bg-slate-700"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform duration-300",
          "bg-white dark:bg-slate-900",
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        )}
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </span>
    </button>
  );
}
