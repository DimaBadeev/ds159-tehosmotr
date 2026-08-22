import { z } from "zod";
import { CAR_BRANDS } from "@/lib/car-brands";
import {
  BY_PHONE_REGEX,
  formatByPhone,
  formatByPlate,
  formatFullName,
  validateByPhone,
  validateByPlate,
  validateCarBrand,
  validateFullName,
} from "@/lib/booking-rules";

const hhmm = z
  .string()
  .transform((value) => value.slice(0, 5))
  .refine((value) => /^\d{2}:\d{2}$/.test(value), "Укажите время ЧЧ:ММ");

const contactPhoneRegex = /^\+?375[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

function issue(message: string) {
  return { code: z.ZodIssueCode.custom, message } as const;
}

export const bookingFormSchema = z.object({
  categoryId: z.string().min(1, "Выберите категорию транспортного средства"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Укажите дату"),
  timeSlot: hhmm,
  clientName: z
    .string()
    .transform((value) => formatFullName(value).trim())
    .superRefine((value, ctx) => {
      const error = validateFullName(value);
      if (error) ctx.addIssue(issue(error));
    }),
  phone: z
    .string()
    .transform((value) => formatByPhone(value))
    .superRefine((value, ctx) => {
      const error = validateByPhone(value);
      if (error) ctx.addIssue(issue(error));
    })
    .refine((value) => BY_PHONE_REGEX.test(value), {
      message: "Телефон в формате +375 (29) 123-45-67, оператор 25, 29, 33 или 44",
    }),
  email: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Укажите корректный email",
    ),
  carNumber: z
    .string()
    .transform((value) => formatByPlate(value))
    .superRefine((value, ctx) => {
      const error = validateByPlate(value);
      if (error) ctx.addIssue(issue(error));
    }),
  carBrand: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const error = validateCarBrand(value, CAR_BRANDS);
      if (error) ctx.addIssue(issue(error));
    }),
  notes: z.string().trim().max(500).optional().default(""),
});

export const adminBookingSchema = bookingFormSchema.extend({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  source: z.enum(["online", "admin"]).optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(120),
  phone: z.string().trim().regex(contactPhoneRegex, "Телефон в формате +375 XX XXX-XX-XX"),
  email: z.string().trim().email("Укажите корректный email"),
  message: z.string().trim().min(10, "Сообщение слишком короткое").max(2000),
});

export const priceUpdateSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(400).optional(),
  price: z.coerce.number().min(0).max(10000),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const workingHoursSchema = z.object({
  weekday: z.coerce.number().int().min(0).max(6),
  isOpen: z.boolean(),
  startTime: hhmm,
  endTime: hhmm,
  breakStart: hhmm,
  breakEnd: hhmm,
  slotDuration: z.coerce.number().int().min(5).max(120),
});

export const closureSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().min(2).max(200),
  allDay: z.boolean().default(true),
  startTime: z.union([hhmm, z.null()]).optional(),
  endTime: z.union([hhmm, z.null()]).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Укажите email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
