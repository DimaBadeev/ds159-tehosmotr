import {
  CalendarCheck,
  CreditCard,
  FileCheck2,
  HeartHandshake,
  Shield,
  Sparkles,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  {
    icon: CalendarCheck,
    title: "Предварительная запись",
    text: "Выбирайте удобный слот онлайн — время закрепляется в базе и не пересекается с другими клиентами.",
  },
  {
    icon: UserRoundCheck,
    title: "Без живых очередей",
    text: "Рабочий график разбит на слоты с учётом обеда, поэтому поток распределён заранее.",
  },
  {
    icon: HeartHandshake,
    title: "Вежливый персонал",
    text: "Клиенты отмечают спокойный приём, понятные объяснения и аккуратное отношение к автомобилю.",
  },
  {
    icon: Sparkles,
    title: "Чисто и аккуратно",
    text: "Порядок на линии диагностики и в зоне оформления документов.",
  },
  {
    icon: CreditCard,
    title: "ЕРИП, карта и наличные",
    text: "С 2024 года доступна оплата через ЕРИП. На станции принимают карту и наличные.",
  },
  {
    icon: Truck,
    title: "Полноприводные авто",
    text: "Принимаем категории M1–M3, N1–N3, прицепы и мотоциклы, включая 4WD.",
  },
  {
    icon: FileCheck2,
    title: "Заявление на месте",
    text: "Заявление водителя можно заполнить прямо на станции — без поездки в другие кабинеты.",
  },
  {
    icon: Shield,
    title: "Пропуск на КПП",
    text: "Перед въездом получите временный пропуск в домике рядом с воротами.",
  },
];

export function Advantages() {
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Почему мы"
          title="Наши преимущества"
          description="Коротко о том, что действительно важно при прохождении гостехосмотра."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <item.icon className="h-5 w-5 text-brand-700" />
              <h3 className="mt-3 text-base font-bold text-brand-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
