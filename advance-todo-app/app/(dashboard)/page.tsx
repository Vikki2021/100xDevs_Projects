import { TodoList } from "@/components/todos/TodoList";

export default function TodosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Todos</h1>
        <p className="text-sm text-muted-foreground">Manage your tasks and sync them to Google Calendar.</p>
      </div>
      <TodoList />
    </div>
  );
}
