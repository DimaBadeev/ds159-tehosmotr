import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { getSlotsForDate } from "@/lib/availability";
import { addDaysYmd, getMinskYmd, weekdayFromYmd } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const today = getMinskYmd();
  const weekday = weekdayFromYmd(today);
  const weekStartOffset = weekday === 0 ? -6 : 1 - weekday;
  const weekStart = addDaysYmd(today, weekStartOffset);
  const weekEnd = addDaysYmd(weekStart, 6);

  const [todayCount, weekCount, pendingCount, unreadMessages] = await Promise.all([
    prisma.booking.count({
      where: { date: today, status: { not: "cancelled" } },
    }),
    prisma.booking.count({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        status: { not: "cancelled" },
      },
    }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const slots = await getSlotsForDate(today);
  const freeToday = slots.slots.filter((slot) => slot.available).length;
  const totalToday = slots.slots.length;

  const upcoming = await prisma.booking.findMany({
    where: {
      date: { gte: today },
      status: { in: ["pending", "confirmed"] },
    },
    include: { category: true },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    take: 8,
  });

  return NextResponse.json({
    today,
    todayCount,
    weekCount,
    pendingCount,
    unreadMessages,
    freeToday,
    totalToday,
    openToday: slots.open,
    upcoming,
  });
}
