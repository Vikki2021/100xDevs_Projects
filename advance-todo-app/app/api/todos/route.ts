import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCalendarEvent } from "@/lib/google-calendar";
import { Priority } from "@prisma/client";

const VALID_PRIORITIES = new Set<string>(["LOW", "MEDIUM", "HIGH"]);

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const priority = searchParams.get("priority");
  const completed = searchParams.get("completed");
  const tag = searchParams.get("tag");

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      ...(priority && VALID_PRIORITIES.has(priority) && { priority: priority as Priority }),
      ...(completed !== null && { completed: completed === "true" }),
      ...(tag && { tags: { has: tag } }),
    },
    include: { subtasks: true },
    orderBy: [{ completed: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, priority, dueDate, tags, subtasks, recurring, syncToCalendar } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

  let calendarEventId: string | null = null;
  if (syncToCalendar && dueDate) {
    try {
      calendarEventId = await createCalendarEvent(session.user.id, title, new Date(dueDate), description) ?? null;
    } catch {
      // Calendar sync is optional — don't block todo creation
    }
  }

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      description,
      priority: priority ?? "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags ?? [],
      recurring,
      calendarEventId,
      userId: session.user.id,
      subtasks: subtasks?.length
        ? { create: subtasks.map((s: string) => ({ title: s })) }
        : undefined,
    },
    include: { subtasks: true },
  });

  return NextResponse.json(todo, { status: 201 });
}
