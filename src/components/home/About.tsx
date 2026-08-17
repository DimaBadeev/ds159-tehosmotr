import { ShieldCheck } from "lucide-react";
import { STATION } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="o-stantsii" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="О станции"
          title="Диагностика с государственной ответственностью"
          description={`${STATION.legalName}. Станция проводит гостехосмотр легковых, грузовых, пассажирских транспортных средств, прицепов и мотоциклов.`}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="card p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-900">Как пройти осмотр</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>Запишитесь онлайн или по телефону {STATION.phone} — так вы избежите ожидания.</li>
              <li>На въезде на территорию получите временный пропуск на КПП: домик стоит рядом с воротами.</li>
              <li>С 2024 года оплату можно провести через ЕРИП, заявление водителя заполняется прямо на станции.</li>
              <li>Клиенты отмечают вежливый персонал, чистоту и аккуратность пункта.</li>
            </ul>
          </article>
          <article className="overflow-hidden rounded-2xl bg-brand-900 p-6 text-white sm:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-accent-400">Полное название</p>
            <h3 className="mt-3 text-xl font-bold leading-snug">{STATION.name}</h3>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-white/50">Адрес</dt>
                <dd className="mt-1 text-white/90">{STATION.address}</dd>
              </div>
              <div>
                <dt className="text-white/50">Телефон</dt>
                <dd className="mt-1 text-white/90">{STATION.phone}</dd>
              </div>
              <div>
                <dt className="text-white/50">Режим</dt>
                <dd className="mt-1 text-white/90">{STATION.hours}</dd>
              </div>
              <div>
                <dt className="text-white/50">Выходные</dt>
                <dd className="mt-1 text-white/90">Суббота и воскресенье</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
