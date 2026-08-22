"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BOOKING_STATUSES, formatRuDate } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { CAR_BRANDS, OTHER_CAR_BRAND } from "@/lib/car-brands";
import { formatByPhone, formatByPlate, formatFullName } from "@/lib/booking-rules";

type Category = { id: string; name: string; code: string; isExtra: boolean };
type Booking = {
  id: string;
  date: string;
  timeSlot: string;
  clientName: string;
  phone: string;
  email: string;
  carNumber: string;
  carBrand: string;
  status: string;
  notes: string;
  categoryId: string;
  category: Category;
};

const emptyForm = {
  categoryId: "",
  date: "",
  timeSlot: "09:00",
  clientName: "",
  phone: "+375 (",
  email: "",
  carNumber: "",
  carBrand: "",
  notes: "",
  status: "confirmed",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [creating, setCreating] = useState(false);
  const [otherBrand, setOtherBrand] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    if (date) params.set("date", date);
    const [bookingsRes, pricesRes] = await Promise.all([
      fetch(`/api/admin/bookings?${params.toString()}`),
      fetch("/api/admin/prices"),
    ]);
    const bookingsData = await bookingsRes.json();
    const pricesData = await pricesRes.json();
    setBookings(bookingsData.bookings ?? []);
    setCategories(pricesData.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainCategories = useMemo(
    () => categories.filter((item) => !item.isExtra),
    [categories],
  );

  const saveCreate = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Не удалось создать запись");
      return;
    }
    toast.success("Запись добавлена");
    setCreating(false);
    setForm(emptyForm);
    load();
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const response = await fetch(`/api/admin/bookings/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Не удалось сохранить");
      return;
    }
    toast.success("Запись обновлена");
    setEditing(null);
    load();
  };

  const changeStatus = async (id: string, nextStatus: string) => {
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Ошибка");
      return;
    }
    toast.success("Статус обновлён");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return;
    const response = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Не удалось удалить");
      return;
    }
    toast.success("Запись удалена");
    load();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold text-brand-900">Записи</h1>
        <button
          type="button"
          className="btn-navy"
          onClick={() => {
            setCreating(true);
            setEditing(null);
            setOtherBrand(false);
            setForm({ ...emptyForm, categoryId: mainCategories[0]?.id ?? "" });
          }}
        >
          Добавить запись
        </button>
      </div>
      <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-card md:grid-cols-4">
        <input className="input" placeholder="ФИО, телефон, номер" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {BOOKING_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-navy" onClick={load}>
          Найти
        </button>
      </div>

      {(creating || editing) && (
        <form onSubmit={editing ? saveEdit : saveCreate} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-card sm:grid-cols-2">
          <h2 className="sm:col-span-2 font-bold text-brand-900">
            {editing ? "Редактирование записи" : "Новая запись"}
          </h2>
          <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
            {mainCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <input className="input" type="time" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {BOOKING_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="ФИО"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: formatFullName(e.target.value) })}
            required
          />
          <input
            className="input"
            placeholder="Телефон +375 (29) 123-45-67"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatByPhone(e.target.value) })}
            required
          />
          <input className="input" placeholder="Email (необязательно)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            className="input uppercase"
            placeholder="Гос. номер 1234 AB-7"
            value={form.carNumber}
            onChange={(e) => setForm({ ...form, carNumber: formatByPlate(e.target.value) })}
            required
          />
          <select
            className={`input ${otherBrand ? "" : "sm:col-span-2"}`}
            value={otherBrand ? OTHER_CAR_BRAND : form.carBrand}
            onChange={(e) => {
              if (e.target.value === OTHER_CAR_BRAND) {
                setOtherBrand(true);
                setForm({ ...form, carBrand: "" });
                return;
              }
              setOtherBrand(false);
              setForm({ ...form, carBrand: e.target.value });
            }}
            required={!otherBrand}
          >
            <option value="">Марка автомобиля</option>
            {CAR_BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
            <option value={OTHER_CAR_BRAND}>{OTHER_CAR_BRAND}</option>
          </select>
          {otherBrand ? (
            <input
              className="input"
              placeholder="Своя марка"
              value={form.carBrand}
              onChange={(e) => setForm({ ...form, carBrand: e.target.value })}
              required
            />
          ) : null}
          <textarea className="input sm:col-span-2" placeholder="Заметка" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="btn-navy">Сохранить</button>
            <button type="button" className="btn border border-slate-200 bg-white" onClick={() => { setCreating(false); setEditing(null); setOtherBrand(false); }}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-card">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Дата</th>
                <th className="px-3 py-3">Клиент</th>
                <th className="px-3 py-3">ТС</th>
                <th className="px-3 py-3">Категория</th>
                <th className="px-3 py-3">Статус</th>
                <th className="px-3 py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-12 text-center text-sm text-slate-500">
                    Пока нет записей. Список заполняется только заявками с сайта
                    или записями, которые вы добавите вручную.
                  </td>
                </tr>
              ) : null}
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-100">
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatRuDate(booking.date)}
                    <br />
                    <span className="text-slate-500">{booking.timeSlot}</span>
                  </td>
                  <td className="px-3 py-3">
                    {booking.clientName}
                    <br />
                    <span className="text-slate-500">{booking.phone}</span>
                    <br />
                    <span className="text-slate-500">{booking.email}</span>
                  </td>
                  <td className="px-3 py-3">
                    {booking.carBrand}
                    <br />
                    {booking.carNumber}
                  </td>
                  <td className="px-3 py-3">{booking.category.name}</td>
                  <td className="px-3 py-3">
                    <select
                      className="input"
                      value={booking.status}
                      onChange={(e) => changeStatus(booking.id, e.target.value)}
                    >
                      {BOOKING_STATUSES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="text-left text-brand-700"
                        onClick={() => {
                          setEditing(booking);
                          setCreating(false);
                          setOtherBrand(!CAR_BRANDS.includes(booking.carBrand));
                          setForm({
                            categoryId: booking.categoryId,
                            date: booking.date,
                            timeSlot: booking.timeSlot,
                            clientName: booking.clientName,
                            phone: booking.phone,
                            email: booking.email,
                            carNumber: booking.carNumber,
                            carBrand: booking.carBrand,
                            notes: booking.notes,
                            status: booking.status,
                          });
                        }}
                      >
                        Изменить
                      </button>
                      <button type="button" className="text-left text-amber-700" onClick={() => changeStatus(booking.id, "cancelled")}>
                        Отменить
                      </button>
                      <button type="button" className="text-left text-red-600" onClick={() => remove(booking.id)}>
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
