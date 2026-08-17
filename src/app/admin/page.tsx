"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRuDate, statusLabel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Spinner";

type Stats = {
  today: string;
  todayCount: number;
  weekCount: number;
  pendingCount: number;
  unreadMessages: number;
  freeToday: number;
  totalToday: number;
  openToday: boolean;
  upcoming: {
    id: string;
    date: string;
    timeSlot: string;
    clientName: string;
    carNumber: string;
    status: string;
    category: { name: string };
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Записей сегодня", value: stats.todayCount },
    { label: "Записей на этой неделе", value: stats.weekCount },
    {
      label: "Свободных слотов сегодня",
      value: stats.openToday ? `${stats.freeToday} из ${stats.totalToday}` : "Выходной",
    },
    { label: "Ожидают подтверждения", value: stats.pendingCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-900">Дашборд</h1>
      <p className="mt-1 text-sm text-slate-500">Сводка на {formatRuDate(stats.today)}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-brand-900">{card.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-900">Ближайшие записи</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-brand-700">
            Все записи
          </Link>
        </div>
        <div className="mt-4 divide-y">
          {stats.upcoming.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">Пока нет ближайших записей.</p>
          ) : (
            stats.upcoming.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <p className="font-medium text-brand-900">
                  {formatRuDate(item.date)}, {item.timeSlot} · {item.clientName}
                </p>
                <p className="text-slate-500">
                  {item.carNumber} · {item.category.name} · {statusLabel(item.status)}
                </p>
              </div>
            ))
          )}
        </div>
        {stats.unreadMessages > 0 ? (
          <Link href="/admin/messages" className="mt-4 inline-block text-sm font-semibold text-accent-600">
            Новых сообщений: {stats.unreadMessages}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
