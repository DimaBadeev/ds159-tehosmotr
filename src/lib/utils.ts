import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} BYN`;
}

export function getMinskYmd(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getMinskTime(date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Minsk",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function weekdayFromYmd(ymd: string): number {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function addDaysYmd(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return date.toISOString().slice(0, 10);
}

export function formatRuDate(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toLocaleDateString(
    "ru-RU",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
}

export function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("375") && digits.length === 12) {
    return `+375 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  return phone;
}

export const BOOKING_STATUSES = [
  { value: "pending", label: "Ожидает" },
  { value: "confirmed", label: "Подтверждено" },
  { value: "completed", label: "Пройдено" },
  { value: "cancelled", label: "Отменено" },
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number]["value"];

export function statusLabel(status: string) {
  return BOOKING_STATUSES.find((item) => item.value === status)?.label ?? status;
}

export const WEEKDAYS_RU = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
