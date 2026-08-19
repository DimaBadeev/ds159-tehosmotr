"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validations";
import { formatPrice, formatRuDate, getMinskYmd } from "@/lib/utils";
import { STATION, WHAT_TO_BRING } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";

type Price = {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isExtra: boolean;
};

type Slot = { time: string; available: boolean };

type Confirmation = {
  id: string;
  date: string;
  timeSlot: string;
  clientName: string;
  phone: string;
  email: string;
  carNumber: string;
  carBrand: string;
  category: string;
  address: string;
  whatToBring: string[];
};

const STEPS = ["Категория", "Дата", "Время", "Данные", "Подтверждение"];

export function BookingWizard({ prices }: { prices: Price[] }) {
  const categories = prices.filter((item) => !item.isExtra);
  const [step, setStep] = useState(0);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [fullDates, setFullDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsOpen, setSlotsOpen] = useState(true);
  const [slotsReason, setSlotsReason] = useState<string | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      categoryId: "",
      date: "",
      timeSlot: "",
      clientName: "",
      phone: "+375",
      email: "",
      carNumber: "",
      carBrand: "",
      notes: "",
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedDate = form.watch("date");
  const selectedTime = form.watch("timeSlot");
  const clientName = form.watch("clientName") ?? "";
  const phone = form.watch("phone") ?? "";
  const carNumber = form.watch("carNumber") ?? "";
  const carBrand = form.watch("carBrand") ?? "";
  const selectedCategory = categories.find((item) => item.id === selectedCategoryId);

  const monthKey = format(month, "yyyy-MM");

  useEffect(() => {
    let cancelled = false;
    setLoadingCalendar(true);
    fetch(`/api/calendar?month=${monthKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setClosedDates(data.closedDates ?? []);
        setFullDates(data.fullDates ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoadingCalendar(false);
      });
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots ?? []);
        setSlotsOpen(data.open !== false);
        setSlotsReason(data.reason ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7;
  const today = getMinskYmd();

  const phoneDigits = phone.replace(/\D/g, "");
  const canNext =
    step === 0
      ? Boolean(selectedCategoryId)
      : step === 1
        ? Boolean(selectedDate)
        : step === 2
          ? Boolean(selectedTime)
          : step === 3
            ? clientName.trim().length >= 3 &&
              phoneDigits.length >= 12 &&
              carNumber.trim().length >= 4 &&
              carBrand.trim().length >= 2
            : true;

  const submit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось создать запись");
      }
      setConfirmation(data.booking);
      toast.success("Вы успешно записаны на техосмотр");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка записи");
    } finally {
      setSubmitting(false);
    }
  });

  if (confirmation) {
    return (
      <div className="card mx-auto max-w-2xl p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-brand-900">Запись подтверждена</h2>
        <p className="mt-2 text-sm text-slate-600">
          {confirmation.clientName}, вы записаны на {formatRuDate(confirmation.date)} в{" "}
          {confirmation.timeSlot}.
        </p>
        <dl className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Адрес</dt>
            <dd className="font-medium text-brand-900">{confirmation.address}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Категория</dt>
            <dd className="font-medium text-brand-900">{confirmation.category}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Авто</dt>
            <dd className="font-medium text-brand-900">
              {confirmation.carBrand}, {confirmation.carNumber}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Телефон</dt>
            <dd className="font-medium text-brand-900">{confirmation.phone}</dd>
          </div>
        </dl>
        <h3 className="mt-6 font-bold text-brand-900">Что взять с собой</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {WHAT_TO_BRING.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          На въезде получите временный пропуск на КПП (домик рядом с воротами). Режим работы:{" "}
          {STATION.hours}.
        </p>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-4xl p-4 sm:p-8">
      <ol className="mb-8 grid grid-cols-5 gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="text-center">
            <span
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                index <= step ? "bg-brand-800 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            <span className="mt-2 hidden text-[11px] font-medium text-slate-500 sm:block">
              {label}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => form.setValue("categoryId", item.id, { shouldValidate: true })}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedCategoryId === item.id
                      ? "border-brand-700 bg-brand-50"
                      : "border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase text-brand-600">{item.code}</p>
                  <p className="mt-1 font-bold text-brand-900">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{formatPrice(item.price)}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <button type="button" className="rounded-full p-2 hover:bg-slate-100" onClick={() => setMonth(addMonths(month, -1))}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="font-bold capitalize text-brand-900">
                  {format(month, "LLLL yyyy", { locale: ru })}
                </p>
                <button type="button" className="rounded-full p-2 hover:bg-slate-100" onClick={() => setMonth(addMonths(month, 1))}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-slate-400">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>
              {loadingCalendar ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: leadingBlanks }).map((_, index) => (
                    <div key={`blank-${index}`} />
                  ))}
                  {days.map((day) => {
                    const ymd = format(day, "yyyy-MM-dd");
                    const disabled =
                      ymd < today || closedDates.includes(ymd) || fullDates.includes(ymd);
                    const selected = selectedDate === ymd;
                    return (
                      <button
                        key={ymd}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          form.setValue("date", ymd, { shouldValidate: true });
                          form.setValue("timeSlot", "");
                        }}
                        className={`aspect-square rounded-xl text-sm font-medium ${
                          selected
                            ? "bg-brand-800 text-white"
                            : disabled
                              ? "cursor-not-allowed text-slate-300"
                              : "text-brand-900 hover:bg-brand-50"
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="mt-3 text-xs text-slate-500">
                Серые дни — прошедшие даты, выходные, технические перерывы или полностью занятые слоты.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              {loadingSlots ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : !slotsOpen ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  {slotsReason ?? "В этот день станция не работает."}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => form.setValue("timeSlot", slot.time, { shouldValidate: true })}
                      className={`rounded-xl border px-2 py-3 text-sm font-semibold ${
                        selectedTime === slot.time
                          ? "border-brand-700 bg-brand-800 text-white"
                          : slot.available
                            ? "border-slate-200 text-brand-900 hover:border-brand-400"
                            : "cursor-not-allowed border-slate-100 text-slate-300"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="label">ФИО</span>
                <input className="input" {...form.register("clientName")} placeholder="Иванов Иван Иванович" />
              </label>
              <label>
                <span className="label">Телефон</span>
                <input className="input" {...form.register("phone")} placeholder="+375 29 123-45-67" />
              </label>
              <label>
                <span className="label">Email <span className="font-normal text-slate-400">(необязательно)</span></span>
                <input className="input" type="email" {...form.register("email")} placeholder="name@mail.by" />
              </label>
              <label>
                <span className="label">Гос. номер</span>
                <input className="input" {...form.register("carNumber")} placeholder="1234 AB-7" />
              </label>
              <label>
                <span className="label">Марка и модель</span>
                <input className="input" {...form.register("carBrand")} placeholder="Volkswagen Tiguan" />
              </label>
              {form.formState.errors.phone ? (
                <p className="sm:col-span-2 text-sm text-red-600">{form.formState.errors.phone.message}</p>
              ) : phoneDigits.length < 12 ? (
                <p className="sm:col-span-2 text-sm text-slate-500">
                  Укажите телефон полностью, например +375 29 123-45-67. Email можно не заполнять.
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3 text-sm">
              <p><span className="text-slate-500">Категория:</span> {selectedCategory?.name}</p>
              <p><span className="text-slate-500">Дата и время:</span> {selectedDate ? formatRuDate(selectedDate) : ""} {selectedTime}</p>
              <p><span className="text-slate-500">Клиент:</span> {form.getValues("clientName")}, {form.getValues("phone")}</p>
              <p><span className="text-slate-500">ТС:</span> {form.getValues("carBrand")}, {form.getValues("carNumber")}</p>
              <p className="rounded-xl bg-slate-50 p-3 text-slate-600">Адрес: {STATION.address}</p>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn border border-slate-200 bg-white text-brand-800"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          Назад
        </button>
        {step < 4 ? (
          <button
            type="button"
            className="btn-navy"
            disabled={!canNext}
            onClick={() => setStep((value) => value + 1)}
          >
            Далее
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={submit} disabled={submitting}>
            {submitting ? <Spinner className="h-4 w-4" /> : null}
            Подтвердить запись
          </button>
        )}
      </div>
    </div>
  );
}
