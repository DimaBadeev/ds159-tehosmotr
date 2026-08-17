import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { STATION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Контакты диагностической станции № 159: ${STATION.address}, телефон ${STATION.phone}, карта проезда и форма обратной связи.`,
};

export default function ContactsPage() {
  return (
    <PublicShell>
      <div className="bg-brand-950 py-12 text-white">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">Контакты</p>
          <h1 className="mt-2 text-3xl font-extrabold">Как связаться и как доехать</h1>
        </div>
      </div>
      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="card space-y-4 p-6 text-sm text-slate-700">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-700" />
                {STATION.address}
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-brand-700" />
                <a href={STATION.phoneHref} className="font-semibold text-brand-800">
                  {STATION.phone}
                </a>
              </p>
              <p className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-brand-700" />
                {STATION.hours}. {STATION.weekend}.
              </p>
              <p className="rounded-xl bg-brand-50 p-4 text-brand-800">
                На въезде получите временный пропуск на КПП — домик рядом с воротами.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                title="Карта проезда"
                src={STATION.mapEmbed}
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-brand-900">Форма обратной связи</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
