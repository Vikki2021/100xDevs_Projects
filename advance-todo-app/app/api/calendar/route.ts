import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listCalendarEvents } from "@/lib/google-calendar";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  const refDate = month ? new Date(month) : new Date();
  const timeMin = startOfMonth(refDate);
  const timeMax = endOfMonth(refDate);

  try {
    const events = await listCalendarEvents(session.user.id, timeMin, timeMax);
    return NextResponse.json(events);
  } catch (err: any) {
    if (err.message === "No Google account linked") {
      return NextResponse.json({ error: "Google account not linked" }, { status: 403 });
    }
    return NextResponse.json({ error: "Calendar fetch failed" }, { status: 500 });
  }
}
