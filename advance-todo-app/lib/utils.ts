import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, startOfDay, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  const sorted = completionDates
    .map((d) => startOfDay(d).getTime())
    .sort((a, b) => b - a);

  const unique = [...new Set(sorted)];
  const today = startOfDay(new Date()).getTime();
  const yesterday = startOfDay(subDays(new Date(), 1)).getTime();

  if (unique[0] !== today && unique[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = differenceInDays(new Date(unique[i - 1]), new Date(unique[i]));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getPriorityColor(priority: string) {
  const map: Record<string, string> = {
    LOW: "text-slate-400 bg-slate-400/10",
    MEDIUM: "text-blue-400 bg-blue-400/10",
    HIGH: "text-amber-400 bg-amber-400/10",
    URGENT: "text-red-400 bg-red-400/10",
  };
  return map[priority] ?? map.MEDIUM;
}

export function getPriorityDot(priority: string) {
  const map: Record<string, string> = {
    LOW: "bg-slate-400",
    MEDIUM: "bg-blue-400",
    HIGH: "bg-amber-400",
    URGENT: "bg-red-400",
  };
  return map[priority] ?? map.MEDIUM;
}
