"use client";

import { useEffect, useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/calendar?month=${currentDate.toISOString()}`);
        if (res.status === 403) { setError("Google Calendar not linked. Sign out and sign in again."); return; }
        if (!res.ok) throw new Error();
        setEvents(await res.json());
      } catch {
        setError("Failed to load calendar events.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function getEventsForDay(day: Date) {
    return events.filter((e) => {
      const eventDate = e.start.dateTime ? new Date(e.start.dateTime) : e.start.date ? new Date(e.start.date) : null;
      return eventDate && isSameDay(eventDate, day);
    });
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())}
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition">
            Today
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">{error}</div>
      )}

      {/* Calendar grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            return (
              <button
                key={day.getTime()}
                onClick={() => setSelectedDay(selectedDay && isSameDay(day, selectedDay) ? null : day)}
                className={cn(
                  "relative min-h-[72px] p-1.5 text-left transition border-b border-r border-border last:border-r-0",
                  !isSameMonth(day, currentDate) && "opacity-30",
                  isSelected && "bg-indigo-600/10",
                  "hover:bg-accent"
                )}
              >
                <span className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday(day) ? "bg-indigo-600 text-white" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="truncate rounded bg-indigo-600/20 px-1 text-[10px] text-indigo-400">
                      {e.summary}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                  )}
                </div>
                {loading && dayEvents.length === 0 && <div className="absolute inset-0 animate-pulse bg-muted/30 rounded" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{format(selectedDay, "EEEE, MMMM d")}</h3>
          {selectedEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground">No events on this day.</p>
          ) : (
            selectedEvents.map((event) => {
              const start = event.start.dateTime ? format(new Date(event.start.dateTime), "h:mm a") : "All day";
              const end = event.end.dateTime ? format(new Date(event.end.dateTime), "h:mm a") : "";
              return (
                <div key={event.id} className="flex items-start justify-between gap-3 rounded-lg bg-indigo-600/10 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.summary}</p>
                    <p className="text-xs text-muted-foreground">{start}{end ? ` – ${end}` : ""}</p>
                    {event.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{event.description}</p>}
                  </div>
                  {event.htmlLink && (
                    <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-indigo-400 transition">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
