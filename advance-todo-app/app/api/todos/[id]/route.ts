import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCalendarEvent } from "@/lib/google-calendar";

async function ownsTodo(userId: string, id: string) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  return todo?.userId === userId ? todo : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const todo = await ownsTodo(session.user.id, id);
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.recurring !== undefined && { recurring: body.recurring }),
    },
    include: { subtasks: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const todo = await ownsTodo(session.user.id, id);
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (todo.calendarEventId) {
    try {
      await deleteCalendarEvent(session.user.id, todo.calendarEventId);
    } catch {
      // ignore — event may already be deleted from Calendar
    }
  }

  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
