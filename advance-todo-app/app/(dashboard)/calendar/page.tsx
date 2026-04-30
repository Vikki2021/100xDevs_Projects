import { CalendarView } from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Google Calendar</h1>
        <p className="text-sm text-muted-foreground">View your events and todos synced from Google Calendar.</p>
      </div>
      <CalendarView />
    </div>
  );
}
