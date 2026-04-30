import { HabitList } from "@/components/habits/HabitList";

export default function HabitsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Habit Tracker</h1>
        <p className="text-sm text-muted-foreground">Build powerful habits. Track streaks and stay consistent.</p>
      </div>
      <HabitList />
    </div>
  );
}
