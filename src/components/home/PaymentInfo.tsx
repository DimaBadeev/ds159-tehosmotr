import { Banknote, CreditCard, Landmark } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const methods = [
  {
    icon: Landmark,
    title: "ЕРИП",
    text: "С 2024 года можно оплатить через систему «Расчёт» (ЕРИП): диагностику станции и отдельно разрешение на допуск ТС.",
  },
  {
    icon: CreditCard,
    title: "Банковская карта",
    text: "Оплата на месте банковской картой после прохождения осмотра.",
  },
  {
    icon: Banknote,
    title: "Наличные",
    text: "Принимаем наличные белорусские рубли на станции.",
  },
];

export function PaymentInfo() {
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Оплата"
          title="Как оплатить техосмотр"
          description="Два платежа: услуги диагностической станции и государственное разрешение на допуск транспортного средства к участию в дорожном движении."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {methods.map((item) => (
            <article key={item.title} className="card p-6">
              <item.icon className="h-5 w-5 text-brand-700" />
              <h3 className="mt-3 text-lg font-bold text-brand-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
