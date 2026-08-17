"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/Spinner";

type Message = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const response = await fetch("/api/admin/messages");
    const data = await response.json();
    setMessages(data.messages ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    const response = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      toast.error("Не удалось обновить");
      return;
    }
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
      <h1 className="text-2xl font-extrabold text-brand-900">Сообщения</h1>
      <div className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-card">Пока нет сообщений.</p>
        ) : (
          messages.map((item) => (
            <article key={item.id} className={`rounded-2xl p-5 shadow-card ${item.isRead ? "bg-white" : "bg-amber-50"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-brand-900">{item.name}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("ru-RU")}</p>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {item.phone} · {item.email}
              </p>
              <p className="mt-3 text-sm text-brand-900">{item.message}</p>
              {!item.isRead ? (
                <button type="button" className="mt-3 text-sm font-semibold text-brand-700" onClick={() => markRead(item.id)}>
                  Отметить прочитанным
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
