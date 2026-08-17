import { Clock, MapPin, Phone } from "lucide-react";
import { STATION } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MapSection() {
  return (
    <section id="kontakty-i-karta" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Контакты и карта проезда"
          title="Как нас найти"
          description="Перед въездом остановитесь у КПП: временный пропуск выдают в домике рядом с воротами."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card space-y-5 p-6">
            <p className="flex gap-3 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-5 w-5 text-brand-700" />
              {STATION.address}
            </p>
            <p className="flex gap-3 text-sm text-slate-700">
              <Phone className="mt-0.5 h-5 w-5 text-brand-700" />
              <a href={STATION.phoneHref} className="font-semibold text-brand-800">
                {STATION.phone}
              </a>
            </p>
            <p className="flex gap-3 text-sm text-slate-700">
              <Clock className="mt-0.5 h-5 w-5 text-brand-700" />
              {STATION.hours}. {STATION.weekend}.
            </p>
            <p className="rounded-xl bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
              Ориентир: территория МГУ МЧС, ул. Антоновская, 9. После получения пропуска следуйте
              указателям к диагностической станции № 159.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              title="Карта проезда к ДС № 159"
              src={STATION.mapEmbed}
              className="h-[320px] w-full lg:h-full min-h-[320px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
