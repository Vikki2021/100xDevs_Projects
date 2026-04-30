import { signIn } from "@/lib/auth";
import { Sparkles, CheckSquare, Flame, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "FlowTask — Advanced Todo & Habit Tracker",
  description:
    "FlowTask is a productivity app for managing todos, building habits with streak tracking, and syncing tasks with Google Calendar.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">FlowTask</h1>
            <p className="mt-1 text-muted-foreground">Advanced Todos · Habit Tracking · Google Calendar</p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <span>Smart Todos with priorities, tags &amp; subtasks</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3">
            <Flame className="h-5 w-5 text-orange-400" />
            <span>Habit streaks with heatmaps &amp; analytics</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3">
            <Calendar className="h-5 w-5 text-green-400" />
            <span>Sync todos directly to Google Calendar</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Get started</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in with Google to manage your tasks, build habits, and sync with Google Calendar.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/privacy" className="underline hover:text-foreground transition">
            Privacy Policy
          </Link>
          . Google Calendar access is requested to sync your todos.
        </p>
      </div>
    </div>
  );
}
