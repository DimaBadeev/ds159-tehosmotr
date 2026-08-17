export function parseMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateTimeSlots(input: {
  startTime: string;
  endTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  slotDuration: number;
}): string[] {
  const slots: string[] = [];
  const duration = Math.max(5, input.slotDuration);
  let current = parseMinutes(input.startTime);
  const end = parseMinutes(input.endTime);
  const breakStart = input.breakStart ? parseMinutes(input.breakStart) : null;
  const breakEnd = input.breakEnd ? parseMinutes(input.breakEnd) : null;

  while (current + duration <= end) {
    const slotEnd = current + duration;
    const overlapsBreak =
      breakStart !== null &&
      breakEnd !== null &&
      current < breakEnd &&
      slotEnd > breakStart;

    if (overlapsBreak) {
      current = breakEnd;
      continue;
    }

    slots.push(formatMinutes(current));
    current += duration;
  }

  return slots;
}

export function slotOverlapsWindow(
  timeSlot: string,
  duration: number,
  windowStart: string,
  windowEnd: string,
) {
  const start = parseMinutes(timeSlot);
  const end = start + duration;
  return start < parseMinutes(windowEnd) && end > parseMinutes(windowStart);
}
