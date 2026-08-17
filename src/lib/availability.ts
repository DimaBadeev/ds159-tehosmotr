import { prisma } from "@/lib/prisma";
import { generateTimeSlots, slotOverlapsWindow } from "@/lib/slots";
import { getMinskTime, getMinskYmd, weekdayFromYmd } from "@/lib/utils";

export async function getSlotsForDate(date: string) {
  const weekday = weekdayFromYmd(date);
  const hours = await prisma.workingHours.findUnique({ where: { weekday } });
  const closures = await prisma.extraClosure.findMany({ where: { date } });

  if (!hours || !hours.isOpen || closures.some((item) => item.allDay)) {
    return {
      open: false,
      reason: !hours || !hours.isOpen ? "Выходной" : closures[0]?.reason ?? "Закрыто",
      slots: [] as { time: string; available: boolean }[],
      slotDuration: hours?.slotDuration ?? 20,
    };
  }

  const taken = await prisma.timeSlotLock.findMany({
    where: { date },
    select: { timeSlot: true },
  });
  const takenSet = new Set(taken.map((item) => item.timeSlot));

  const generated = generateTimeSlots({
    startTime: hours.startTime,
    endTime: hours.endTime,
    breakStart: hours.breakStart,
    breakEnd: hours.breakEnd,
    slotDuration: hours.slotDuration,
  }).filter((time) => {
    return !closures.some((closure) => {
      if (closure.allDay || !closure.startTime || !closure.endTime) return false;
      return slotOverlapsWindow(
        time,
        hours.slotDuration,
        closure.startTime,
        closure.endTime,
      );
    });
  });

  const today = getMinskYmd();
  const nowTime = getMinskTime();

  const slots = generated.map((time) => {
    const isPast = date < today || (date === today && time <= nowTime);
    return {
      time,
      available: !isPast && !takenSet.has(time),
    };
  });

  return {
    open: true,
    reason: null as string | null,
    slots,
    slotDuration: hours.slotDuration,
  };
}

export async function isDateFullyBooked(date: string) {
  const result = await getSlotsForDate(date);
  if (!result.open) return true;
  return result.slots.length > 0 && result.slots.every((slot) => !slot.available);
}
