import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/utils";
import { startOfDay } from "date-fns";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const habit = await prisma.habit.findUnique({
    where: { id },
    include: { completions: { orderBy: { date: "desc" } } },
  });
  if (!habit || habit.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const targetDate = body.date ? new Date(body.date) : new Date();
  const dateKey = startOfDay(targetDate);

  // Prevent duplicate completion for same day
  const existing = habit.completions.find(
    (c) => startOfDay(c.date).getTime() === dateKey.getTime()
  );

  if (existing) {
    // Toggle off — remove the completion
    await prisma.habitCompletion.delete({ where: { id: existing.id } });
    const remaining = habit.completions.filter((c) => c.id !== existing.id);
    const streak = calculateStreak(remaining.map((c) => c.date));
    await prisma.habit.update({ where: { id }, data: { streak } });
    return NextResponse.json({ toggled: "off", streak });
  }

  // Add completion
  const completion = await prisma.habitCompletion.create({
    data: { habitId: id, date: dateKey, note: body.note },
  });

  const allCompletions = [dateKey, ...habit.completions.map((c) => c.date)];
  const streak = calculateStreak(allCompletions);
  const longestStreak = Math.max(streak, habit.longestStreak);

  await prisma.habit.update({ where: { id }, data: { streak, longestStreak } });

  return NextResponse.json({ toggled: "on", completion, streak, longestStreak });
}
