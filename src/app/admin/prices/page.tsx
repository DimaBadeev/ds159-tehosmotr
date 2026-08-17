"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

type Item = {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isExtra: boolean;
};

export default function AdminPricesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const response = await fetch("/api/admin/prices");
    const data = await response.json();
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (item: Item) => {
    const response = await fetch("/api/admin/prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        isActive: item.isActive,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Не удалось сохранить");
      return;
    }
    toast.success(`Цена «${item.code}» обновлена`);
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
      <h1 className="text-2xl font-extrabold text-brand-900">Цены</h1>
      <p className="mt-1 text-sm text-slate-500">Изменения сразу отображаются на сайте.</p>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <article key={item.id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="grid gap-3 lg:grid-cols-[140px_1fr_140px_auto] lg:items-center">
              <p className="font-bold text-brand-800">
                {item.code}
                {item.isExtra ? <span className="ml-2 text-xs font-medium text-slate-400">доп.</span> : null}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className="input"
                  value={item.name}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, name: e.target.value };
                    setItems(next);
                  }}
                />
                <input
                  className="input"
                  value={item.description}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, description: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
              <input
                className="input"
                type="number"
                min={0}
                step="0.01"
                value={item.price}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...item, price: Number(e.target.value) };
                  setItems(next);
                }}
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, isActive: e.target.checked };
                      setItems(next);
                    }}
                  />
                  Активна
                </label>
                <button type="button" className="btn-navy" onClick={() => save(item)}>
                  Сохранить
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Сейчас на сайте: {formatPrice(item.price)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
