import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDateFullyBooked } from "@/lib/availability";
import { addDaysYmd, getMinskYmd, weekdayFromYmd } from "@/lib/utils";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return jsonError("Укажите месяц в формате YYYY-MM");
  }

  const [year, monthNum] = month.split("-").map(Number);
  const start = `${month}-01`;
  const lastDay = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const today = getMinskYmd();

  const hours = await prisma.workingHours.findMany();
  const hoursMap = new Map(hours.map((item) => [item.weekday, item]));
  const closures = await prisma.extraClosure.findMany({
    where: {
      date: {
        gte: start,
        lte: `${month}-${String(lastDay).padStart(2, "0")}`,
      },
    },
  });
  const closedSet = new Set(
    closures.filter((item) => item.allDay).map((item) => item.date),
  );

  const closedDates: string[] = [];
  const fullDates: string[] = [];

  for (let day = 1; day <= lastDay; day += 1) {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    if (date < today) {
      closedDates.push(date);
      continue;
    }
    const weekday = weekdayFromYmd(date);
    const dayHours = hoursMap.get(weekday);
    if (!dayHours?.isOpen || closedSet.has(date)) {
      closedDates.push(date);
      continue;
    }
    if (await isDateFullyBooked(date)) {
      fullDates.push(date);
    }
  }

  return NextResponse.json({
    month,
    closedDates,
    fullDates,
    today,
    nextOpenHint: addDaysYmd(today, 1),
  });
}
