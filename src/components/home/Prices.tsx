import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Price = {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isExtra: boolean;
};

export function Prices({ items }: { items: Price[] }) {
  const main = items.filter((item) => !item.isExtra);
  const extra = items.filter((item) => item.isExtra);

  return (
    <section id="uslugi-i-tseny" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Услуги и цены"
          title="Стоимость диагностики по категориям ТС"
          description="Цены можно изменить в панели администратора — без правки кода. Отдельно оплачивается разрешение на допуск ТС (Белтехосмотр / ЕРИП)."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {main.map((item) => (
            <article key={item.id} className="card flex flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                {item.code}
              </p>
              <h3 className="mt-2 text-lg font-bold text-brand-900">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
              <p className="mt-4 text-2xl font-extrabold text-brand-800">{formatPrice(item.price)}</p>
            </article>
          ))}
        </div>
        {extra.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-brand-900">Дополнительные услуги</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {extra.map((item) => (
                <article key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <div>
                    <h4 className="font-semibold text-brand-900">{item.name}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  </div>
                  <p className="shrink-0 text-lg font-bold text-brand-800">{formatPrice(item.price)}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-8 flex justify-center">
          <Link href="/zapisatsya" className="btn-navy">
            Записаться на техосмотр
          </Link>
        </div>
      </div>
    </section>
  );
}
