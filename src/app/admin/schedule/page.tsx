"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WEEKDAYS_RU, formatRuDate } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

type Hours = {
  weekday: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  slotDuration: number;
};

type Closure = {
  id: string;
  date: string;
  reason: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
};

export default function AdminSchedulePage() {
  const [hours, setHours] = useState<Hours[]>([]);
  const [closures, setClosures] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);
  const [closure, setClosure] = useState({
    date: "",
    reason: "Технический перерыв",
    allDay: true,
    startTime: "09:00",
    endTime: "17:00",
  });

  const load = async () => {
    const response = await fetch("/api/admin/schedule");
    const data = await response.json();
    setHours(data.hours ?? []);
    setClosures(data.closures ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveHours = async () => {
    const response = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Не удалось сохранить график");
      return;
    }
    toast.success("Расписание обновлено");
    setHours(data.hours);
  };

  const addClosure = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/closures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...closure,
        startTime: closure.allDay ? null : closure.startTime,
        endTime: closure.allDay ? null : closure.endTime,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Не удалось добавить");
      return;
    }
    toast.success("День / перерыв добавлен");
    setClosure({ date: "", reason: "Технический перерыв", allDay: true, startTime: "09:00", endTime: "17:00" });
    load();
  };

  const removeClosure = async (id: string) => {
    const response = await fetch(`/api/admin/closures?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Не удалось удалить");
      return;
    }
    toast.success("Удалено");
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-900">Расписание</h1>
      <p className="mt-1 text-sm text-slate-500">
        Рабочие часы, обед, длительность слота и дополнительные выходные.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-4 shadow-card">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="p-2">День</th>
              <th className="p-2">Открыто</th>
              <th className="p-2">Начало</th>
              <th className="p-2">Конец</th>
              <th className="p-2">Обед с</th>
              <th className="p-2">Обед до</th>
              <th className="p-2">Слот, мин</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((item, index) => (
              <tr key={item.weekday} className="border-t">
                <td className="p-2 font-medium">{WEEKDAYS_RU[item.weekday]}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={(e) => {
                      const next = [...hours];
                      next[index] = { ...item, isOpen: e.target.checked };
                      setHours(next);
                    }}
                  />
                </td>
                {(["startTime", "endTime", "breakStart", "breakEnd"] as const).map((field) => (
                  <td key={field} className="p-2">
                    <input
                      className="input"
                      type="time"
                      value={item[field]}
                      onChange={(e) => {
                        const next = [...hours];
                        next[index] = { ...item, [field]: e.target.value };
                        setHours(next);
                      }}
                    />
                  </td>
                ))}
                <td className="p-2">
                  <input
                    className="input"
                    type="number"
                    min={5}
                    max={120}
                    value={item.slotDuration}
                    onChange={(e) => {
                      const next = [...hours];
                      next[index] = { ...item, slotDuration: Number(e.target.value) };
                      setHours(next);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn-navy mt-4" onClick={saveHours}>
          Сохранить график
        </button>
      </div>

      <form onSubmit={addClosure} className="mt-8 rounded-2xl bg-white p-4 shadow-card">
        <h2 className="font-bold text-brand-900">Дополнительные выходные и технические перерывы</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input className="input" type="date" value={closure.date} onChange={(e) => setClosure({ ...closure, date: e.target.value })} required />
          <input className="input" placeholder="Причина" value={closure.reason} onChange={(e) => setClosure({ ...closure, reason: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={closure.allDay} onChange={(e) => setClosure({ ...closure, allDay: e.target.checked })} />
            Весь день
          </label>
          <input className="input" type="time" disabled={closure.allDay} value={closure.startTime} onChange={(e) => setClosure({ ...closure, startTime: e.target.value })} />
          <input className="input" type="time" disabled={closure.allDay} value={closure.endTime} onChange={(e) => setClosure({ ...closure, endTime: e.target.value })} />
        </div>
        <button type="submit" className="btn-navy mt-4">Добавить</button>
        <ul className="mt-4 divide-y text-sm">
          {closures.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <span>
                {formatRuDate(item.date)} · {item.reason}
                {item.allDay ? " · весь день" : ` · ${item.startTime}–${item.endTime}`}
              </span>
              <button type="button" className="text-red-600" onClick={() => removeClosure(item.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
