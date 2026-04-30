import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      completions: {
        orderBy: { date: "desc" },
        take: 90,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Recalculate streaks dynamically
  const habitsWithStreak = habits.map((habit) => {
    const dates = habit.completions.map((c) => c.date);
    const streak = calculateStreak(dates);
    return { ...habit, streak };
  });

  return NextResponse.json(habitsWithStreak);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, color, icon, frequency, targetDays } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const habit = await prisma.habit.create({
    data: {
      name: name.trim(),
      description,
      color: color ?? "#6366f1",
      icon: icon ?? "🎯",
      frequency: frequency ?? "DAILY",
      targetDays: targetDays ?? [],
      userId: session.user.id,
    },
    include: { completions: true },
  });

  return NextResponse.json(habit, { status: 201 });
}
