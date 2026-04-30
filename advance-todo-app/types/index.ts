export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type FrequencyType = "DAILY" | "WEEKLY" | "CUSTOM";
export type RecurringType = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  todoId: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: Priority;
  dueDate?: string | null;
  tags: string[];
  userId: string;
  subtasks: Subtask[];
  calendarEventId?: string | null;
  recurring?: RecurringType | null;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  note?: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  frequency: FrequencyType;
  targetDays: number[];
  streak: number;
  longestStreak: number;
  userId: string;
  completions: HabitCompletion[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}
